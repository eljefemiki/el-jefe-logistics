import "server-only";
import { prisma } from "@/src/lib/prisma";
import { fetchCompanyJobs, getTruckyConfiguration } from "./client";
import { eventFingerprint, normalizeJob } from "./normalize";
import { verifyHmacSha256 } from "./signature";
import type { ImportResult, NormalizedJob } from "./types";

export function verifyWebhook(rawBody: string, signature: string | null) {
  const secret = getTruckyConfiguration().webhookSecret;
  if (!secret) throw new Error("TRUCKY_WEBHOOK_SECRET must be configured.");
  return verifyHmacSha256(rawBody, signature, secret);
}

async function matchDriver(job: NormalizedJob) {
  const clauses = [
    job.truckyUserId ? { truckyUserId: job.truckyUserId } : undefined,
    job.steamId ? { steamId: job.steamId } : undefined,
  ].filter(Boolean) as Array<{ truckyUserId: string } | { steamId: string }>;
  if (!clauses.length) return null;
  return prisma.driver.findFirst({ where: { OR: clauses } });
}

async function matchTruck(job: NormalizedJob) {
  const clauses = [
    job.truckyVehicleId ? { truckyVehicleId: job.truckyVehicleId } : undefined,
    job.registration ? { registration: { equals: job.registration, mode: "insensitive" as const } } : undefined,
  ].filter(Boolean) as Array<{ truckyVehicleId: string } | { registration: { equals: string; mode: "insensitive" } }>;
  if (!clauses.length) return null;
  return prisma.truck.findFirst({ where: { OR: clauses } });
}

export async function importJob(job: NormalizedJob): Promise<ImportResult> {
  const {
    truckyUserId: _truckyUserId,
    steamId: _steamId,
    truckyUsername: _truckyUsername,
    truckyVehicleId: _truckyVehicleId,
    registration: _registration,
    ...transportJob
  } = job;
  const [driver, truck, existing] = await Promise.all([
    matchDriver(job), matchTruck(job),
    prisma.transportJob.findUnique({ where: { truckyJobId: job.truckyJobId }, select: { id: true, status: true } }),
  ]);
  const costs = (job.fuelCost ?? 0) + (job.tollCost ?? 0) + (job.ferryCost ?? 0) + (job.damageCost ?? 0) + (job.otherCosts ?? 0);
  const profit = job.profit ?? (job.revenue === undefined ? undefined : job.revenue - costs);
  const saved = await prisma.$transaction(async (tx) => {
    const result = await tx.transportJob.upsert({
      where: { truckyJobId: job.truckyJobId },
      create: { ...transportJob, profit, driverId: driver?.id, truckId: truck?.id },
      update: { ...transportJob, profit, driverId: driver?.id, truckId: truck?.id },
    });
    if (driver) {
      await tx.driver.update({
        where: { id: driver.id },
        data: {
          truckyUserId: job.truckyUserId ?? undefined, steamId: job.steamId ?? undefined,
          truckyUsername: job.truckyUsername ?? undefined, lastTruckySyncAt: new Date(),
          ...(job.status === "COMPLETED" && existing?.status !== "COMPLETED" ? {
            totalDeliveries: { increment: 1 },
            totalDistanceKm: { increment: job.drivenDistanceKm ?? job.distanceKm ?? 0 },
          } : {}),
        },
      });
    }
    if (truck) {
      await tx.truck.update({
        where: { id: truck.id },
        data: {
          truckyVehicleId: job.truckyVehicleId ?? undefined,
          mileage: job.status === "COMPLETED" && existing?.status !== "COMPLETED"
            ? { increment: job.drivenDistanceKm ?? job.distanceKm ?? 0 } : undefined,
        },
      });
      const issues = [
        { component: "Vehicle", kind: "DAMAGE" as const, value: job.damagePercent, threshold: 1 },
        { component: "Truck wearing parts", kind: "WEAR" as const, value: job.truckWearPercent, threshold: 20 },
        { component: "Trailer wearing parts", kind: "WEAR" as const, value: job.trailerWearPercent, threshold: 20 },
      ];
      for (const issue of issues) if (issue.value !== undefined && issue.value >= issue.threshold) {
        const externalKey = `${job.truckyJobId}:${issue.kind}:${issue.component}`;
        await tx.vehicleIssue.upsert({
          where: { externalKey },
          create: {
            externalKey, truckId: truck.id, transportJobId: result.id, kind: issue.kind,
            component: issue.component, title: `${issue.component} reported at ${issue.value.toFixed(1)}%`,
            severity: issue.value >= 50 ? 4 : issue.value >= 25 ? 3 : 2,
            wearPercent: issue.kind === "WEAR" ? issue.value : undefined,
            damagePercent: issue.kind === "DAMAGE" ? issue.value : undefined,
            rawPayload: job.rawPayload,
          },
          update: {
            wearPercent: issue.kind === "WEAR" ? issue.value : undefined,
            damagePercent: issue.kind === "DAMAGE" ? issue.value : undefined,
            rawPayload: job.rawPayload,
          },
        });
      }
    }
    return result;
  });
  return { jobId: saved.id, created: !existing, driverMatched: Boolean(driver), truckMatched: Boolean(truck) };
}

export async function processWebhook(rawBody: string) {
  const parsed: unknown = JSON.parse(rawBody);
  if (!parsed || typeof parsed !== "object") throw new Error("Invalid webhook body.");
  const root = parsed as Record<string, unknown>;
  const eventType = typeof root.event === "string" ? root.event : "";
  const fingerprint = eventFingerprint(rawBody);
  const existing = await prisma.truckyEvent.findUnique({ where: { fingerprint } });
  if (existing?.processedAt) return { duplicate: true, eventId: existing.id };
  const event = await prisma.truckyEvent.upsert({
    where: { fingerprint },
    create: { fingerprint, eventType, payload: JSON.parse(rawBody) },
    update: { error: null },
  });
  try {
    let result: ImportResult | undefined;
    if (["job_created", "job_completed", "job_canceled", "job_deleted"].includes(eventType)) {
      result = await importJob(normalizeJob(parsed, eventType));
    }
    if (["vehicle_need_maintenance", "vehicle_maintenance_complete"].includes(eventType)) {
      const data = root.data && typeof root.data === "object" ? root.data as Record<string, unknown> : {};
      const vehicle = data.vehicle && typeof data.vehicle === "object" ? data.vehicle as Record<string, unknown> : data;
      const vehicleId = String(vehicle.id ?? vehicle._id ?? vehicle.vehicle_id ?? "");
      const registration = String(vehicle.registration ?? vehicle.license_plate ?? vehicle.plate ?? "");
      const truck = await prisma.truck.findFirst({ where: { OR: [
        ...(vehicleId ? [{ truckyVehicleId: vehicleId }] : []),
        ...(registration ? [{ registration: { equals: registration, mode: "insensitive" as const } }] : []),
      ] } });
      if (truck) {
        const externalKey = `trucky:maintenance:${vehicleId || truck.id}`;
        if (eventType === "vehicle_need_maintenance") {
          await prisma.vehicleIssue.upsert({
            where: { externalKey },
            create: { externalKey, truckId: truck.id, kind: "SERVICE", component: "Scheduled service", title: "Trucky reports vehicle maintenance is required", severity: 3, rawPayload: JSON.parse(rawBody) },
            update: { status: "OPEN", resolvedAt: null, rawPayload: JSON.parse(rawBody) },
          });
          await prisma.truck.update({ where: { id: truck.id }, data: { status: "MAINTENANCE", truckyVehicleId: vehicleId || undefined } });
        } else {
          await prisma.vehicleIssue.updateMany({ where: { externalKey }, data: { status: "RESOLVED", resolvedAt: new Date(), rawPayload: JSON.parse(rawBody) } });
          const openJobs = await prisma.maintenanceJob.count({ where: { truckId: truck.id, status: { notIn: ["COMPLETED", "CANCELLED"] } } });
          if (!openJobs) await prisma.truck.update({ where: { id: truck.id }, data: { status: "AVAILABLE" } });
        }
      }
    }
    await prisma.truckyEvent.update({ where: { id: event.id }, data: { processedAt: new Date(), externalId: result?.jobId } });
    return { duplicate: false, eventId: event.id, result };
  } catch (error) {
    await prisma.truckyEvent.update({ where: { id: event.id }, data: { error: error instanceof Error ? error.message : "Unknown ingestion error" } });
    throw error;
  }
}

export async function synchronizeJobs() {
  const startedAt = new Date();
  await prisma.truckySyncState.upsert({ where: { id: "company" }, create: { id: "company", lastStartedAt: startedAt }, update: { lastStartedAt: startedAt, lastError: null } });
  let imported = 0, failed = 0;
  try {
    const jobs = await fetchCompanyJobs();
    for (const payload of jobs) {
      try { await importJob(normalizeJob(payload)); imported += 1; } catch { failed += 1; }
    }
    await prisma.truckySyncState.update({ where: { id: "company" }, data: {
      lastCompletedAt: new Date(), lastSuccessfulAt: new Date(), imported: { increment: imported }, failed: { increment: failed },
    } });
    return { received: jobs.length, imported, failed };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown synchronization error";
    await prisma.truckySyncState.update({ where: { id: "company" }, data: { lastCompletedAt: new Date(), lastError: message, failed: { increment: 1 } } });
    throw error;
  }
}
