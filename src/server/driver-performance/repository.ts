import { prisma } from "@/src/lib/prisma";
import type { DriverPerformanceEntryInput } from "./validation";

export async function recordDriverPerformanceEntry(
  recordedById: string,
  data: DriverPerformanceEntryInput,
) {
  return prisma.$transaction(async (tx) => {
    const [driver, customer] = await Promise.all([
      tx.driver.findFirst({
        where: { id: data.driverId, archivedAt: null },
        select: { id: true },
      }),
      tx.customer.findFirst({
        where: { id: data.customerId, archivedAt: null },
        select: { id: true },
      }),
    ]);
    if (!driver || !customer) {
      throw new Error("The selected driver or company is unavailable.");
    }

    if (data.contractListingId) {
      const contract = await tx.contractListing.findFirst({
        where: {
          id: data.contractListingId,
          customerId: data.customerId,
          awardedBid: { driverId: data.driverId },
        },
        select: { id: true },
      });
      if (!contract) {
        throw new Error(
          "The selected contract is not awarded to this driver and company.",
        );
      }
    }

    const entry = await tx.driverPerformanceEntry.create({
      data: { ...data, recordedById },
    });
    const reputation = await tx.driverPerformanceEntry.aggregate({
      where: { driverId: data.driverId },
      _avg: { reputationScore: true },
    });
    const updatedDriver = await tx.driver.update({
      where: { id: data.driverId },
      data: {
        totalDistanceKm: { increment: data.distanceKm },
        totalDeliveries: { increment: 1 },
        reputation: reputation._avg.reputationScore ?? 100,
      },
    });

    return { entry, driver: updatedDriver };
  });
}
