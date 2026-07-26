import "server-only";
import { prisma } from "@/src/lib/prisma";
import { getTruckyConfiguration, probeTruckyApi } from "./client";

export async function getTruckyIntegrationHealth() {
  const config = getTruckyConfiguration();
  const [sync, lastWebhook, failedEvents, eventCount, jobCount, unmatchedJobs, drivers, truckCounts, api] = await Promise.all([
    prisma.truckySyncState.findUnique({ where: { id: "company" } }),
    prisma.truckyEvent.findFirst({ orderBy: { receivedAt: "desc" } }),
    prisma.truckyEvent.findMany({
      where: { error: { not: null }, processedAt: null },
      orderBy: { receivedAt: "desc" }, take: 25,
      select: { id: true, eventType: true, receivedAt: true, error: true },
    }),
    prisma.truckyEvent.count(),
    prisma.transportJob.count(),
    prisma.transportJob.count({ where: { OR: [{ driverId: null }, { truckId: null }] } }),
    prisma.driver.findMany({
      where: { archivedAt: null }, orderBy: { employeeNumber: "asc" },
      select: {
        id: true, employeeNumber: true, truckyUserId: true, steamId: true,
        truckyUsername: true, lastTruckySyncAt: true,
        account: { select: { firstName: true, lastName: true } },
        _count: { select: { transportJobs: true } },
      },
    }),
    Promise.all([prisma.truck.count(), prisma.truck.count({ where: { truckyVehicleId: { not: null } } })]),
    probeTruckyApi().catch((error) => ({
      ok: false as const,
      error: error instanceof Error ? error.message : "Trucky API check failed.",
    })),
  ]);
  const mappedDrivers = drivers.filter((driver) => driver.truckyUserId || driver.steamId).length;
  return {
    configuration: {
      companyId: Boolean(config.companyId), companyToken: Boolean(config.token),
      webhookSecret: Boolean(config.webhookSecret), userAgent: Boolean(config.userAgent),
    },
    api, sync,
    webhook: { configured: Boolean(config.webhookSecret), last: lastWebhook, total: eventCount, failed: failedEvents },
    jobs: { total: jobCount, unmatched: unmatchedJobs },
    mappings: { drivers, driverTotal: drivers.length, mappedDrivers, truckTotal: truckCounts[0], mappedTrucks: truckCounts[1] },
    schedulerConfigured: Boolean(process.env.TRUCKY_SYNC_SECRET),
  };
}
