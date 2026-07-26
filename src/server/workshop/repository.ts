import { prisma } from "@/src/lib/prisma";
import type { MaintenanceJobInput, WorkshopFilters } from "./types";

export const jobInclude = {
  truck: { select: { id: true, fleetNumber: true, registration: true, manufacturer: true, model: true, status: true } },
} as const;

export function findMaintenanceJobs(filters: WorkshopFilters = {}) {
  return prisma.maintenanceJob.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.priority ? { priority: filters.priority } : {}),
      ...(filters.search ? {
        OR: [
          { jobNumber: { contains: filters.search, mode: "insensitive" } },
          { title: { contains: filters.search, mode: "insensitive" } },
          { truck: { fleetNumber: { contains: filters.search, mode: "insensitive" } } },
          { truck: { registration: { contains: filters.search, mode: "insensitive" } } },
        ],
      } : {}),
    },
    include: jobInclude,
    orderBy: [{ priority: "desc" }, { reportedAt: "desc" }],
  });
}

export function findMaintenanceJob(id: string) {
  return prisma.maintenanceJob.findUnique({ where: { id }, include: jobInclude });
}

export function findWorkshopTrucks(currentTruckId?: string) {
  return prisma.truck.findMany({
    where: currentTruckId
      ? { OR: [{ archivedAt: null }, { id: currentTruckId }] }
      : { archivedAt: null },
    select: { id: true, fleetNumber: true, registration: true, manufacturer: true, model: true, mileage: true },
    orderBy: { fleetNumber: "asc" },
  });
}

export async function insertMaintenanceJob(jobNumber: string, data: MaintenanceJobInput) {
  return prisma.$transaction(async (tx) => {
    const job = await tx.maintenanceJob.create({ data: { ...data, jobNumber }, include: jobInclude });
    if (!["COMPLETED", "CANCELLED"].includes(data.status)) {
      await tx.truck.update({ where: { id: data.truckId }, data: { status: "MAINTENANCE" } });
    }
    return job;
  });
}

export async function reviseMaintenanceJob(id: string, data: MaintenanceJobInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.maintenanceJob.findUniqueOrThrow({
      where: { id },
      select: { truckId: true },
    });
    const job = await tx.maintenanceJob.update({
      where: { id },
      data: {
        ...data,
        startedAt: data.status === "IN_PROGRESS" ? new Date() : undefined,
        completedAt: data.status === "COMPLETED" ? new Date() : null,
      },
      include: jobInclude,
    });
    const affectedTruckIds = [...new Set([existing.truckId, data.truckId])];
    for (const truckId of affectedTruckIds) {
      const openJobs = await tx.maintenanceJob.count({
        where: { truckId, status: { notIn: ["COMPLETED", "CANCELLED"] } },
      });
      await tx.truck.update({
        where: { id: truckId },
        data: { status: openJobs === 0 ? "AVAILABLE" : "MAINTENANCE" },
      });
    }
    return job;
  });
}
