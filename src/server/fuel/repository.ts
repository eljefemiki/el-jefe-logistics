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

export function findFuelTrucks() {
  return prisma.truck.findMany({
    select: { id: true, fleetNumber: true, registration: true, manufacturer: true, model: true, mileage: true, fuelLevel: true },
    orderBy: { fleetNumber: "asc" },
  });
}

export async function insertFuelEntry(reference: string, data: FuelEntryInput) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.fuelEntry.create({
      data: { ...data, reference, totalCost: data.quantity * data.unitPrice },
      include: fuelInclude,
    });
    await tx.truck.update({
      where: { id: data.truckId },
      data: {
        mileage: data.odometerKm,
        ...(data.fuelLevelAfter !== undefined ? { fuelLevel: data.fuelLevelAfter } : {}),
      },
    });
    return entry;
  });
}

export async function reviseFuelEntry(id: string, data: FuelEntryInput) {
  return prisma.$transaction(async (tx) => {
    const entry = await tx.fuelEntry.update({
      where: { id },
      data: { ...data, totalCost: data.quantity * data.unitPrice },
      include: fuelInclude,
    });
    const latest = await tx.fuelEntry.findFirst({ where: { truckId: data.truckId }, orderBy: { purchasedAt: "desc" } });
    if (latest?.id === id) {
      await tx.truck.update({
        where: { id: data.truckId },
        data: { mileage: data.odometerKm, ...(data.fuelLevelAfter !== undefined ? { fuelLevel: data.fuelLevelAfter } : {}) },
      });
    }
    return entry;
  });
}
