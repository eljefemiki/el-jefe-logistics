import { prisma } from "@/src/lib/prisma";
import type { FuelEntryInput, FuelFilters } from "./types";

export const fuelInclude = {
  truck: { select: { id: true, fleetNumber: true, registration: true, manufacturer: true, model: true } },
} as const;

export function findFuelEntries(filters: FuelFilters = {}) {
  return prisma.fuelEntry.findMany({
    where: {
      ...(filters.fuelType ? { fuelType: filters.fuelType } : {}),
      ...(filters.truckId ? { truckId: filters.truckId } : {}),
      ...(filters.search ? { OR: [
        { reference: { contains: filters.search, mode: "insensitive" } },
        { station: { contains: filters.search, mode: "insensitive" } },
        { location: { contains: filters.search, mode: "insensitive" } },
        { receiptNumber: { contains: filters.search, mode: "insensitive" } },
        { truck: { fleetNumber: { contains: filters.search, mode: "insensitive" } } },
        { truck: { registration: { contains: filters.search, mode: "insensitive" } } },
      ] } : {}),
    },
    include: fuelInclude,
    orderBy: { purchasedAt: "desc" },
  });
}

export function findFuelEntry(id: string) {
  return prisma.fuelEntry.findUnique({ where: { id }, include: fuelInclude });
}

export function findFuelTrucks(currentTruckId?: string) {
  return prisma.truck.findMany({
    where: currentTruckId
      ? { OR: [{ archivedAt: null }, { id: currentTruckId }] }
      : { archivedAt: null },
    select: { id: true, fleetNumber: true, registration: true, manufacturer: true, model: true, mileage: true, fuelLevel: true },
    orderBy: { fleetNumber: "asc" },
  });
}

async function refreshTruckFromLatestEntry(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  truckId: string,
) {
  const [latest, truck] = await Promise.all([
    tx.fuelEntry.findFirst({
      where: { truckId },
      orderBy: [{ purchasedAt: "desc" }, { createdAt: "desc" }],
    }),
    tx.truck.findUniqueOrThrow({ where: { id: truckId }, select: { mileage: true } }),
  ]);
  if (!latest) return;
  await tx.truck.update({
    where: { id: truckId },
    data: {
      mileage: Math.max(truck.mileage, latest.odometerKm),
      ...(latest.fuelLevelAfter !== null ? { fuelLevel: latest.fuelLevelAfter } : {}),
    },
  });
}

export async function insertFuelEntry(reference: string, data: FuelEntryInput) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.fuelEntry.create({
      data: { ...data, reference, totalCost: data.quantity * data.unitPrice },
      include: fuelInclude,
    });
    await refreshTruckFromLatestEntry(tx, data.truckId);
    return entry;
  });
}

export async function reviseFuelEntry(id: string, data: FuelEntryInput) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.fuelEntry.findUniqueOrThrow({
      where: { id },
      select: { truckId: true },
    });
    const entry = await tx.fuelEntry.update({
      where: { id },
      data: { ...data, totalCost: data.quantity * data.unitPrice },
      include: fuelInclude,
    });
    for (const truckId of [...new Set([existing.truckId, data.truckId])]) {
      await refreshTruckFromLatestEntry(tx, truckId);
    }
    return { ...entry, previousTruckId: existing.truckId };
  });
}
