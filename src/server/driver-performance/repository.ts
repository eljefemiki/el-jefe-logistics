import { prisma } from "@/src/lib/prisma";
import type { DriverPerformanceEntryInput } from "./validation";

export async function recordDriverPerformanceEntry(
  recordedById: string,
  data: DriverPerformanceEntryInput,
) {
  return prisma.$transaction(async (tx) => {
    const [driver, customer, settings] = await Promise.all([
      tx.driver.findFirst({
        where: { id: data.driverId, archivedAt: null },
        select: { id: true },
      }),
      tx.customer.findFirst({
        where: { id: data.customerId, archivedAt: null },
        select: { id: true, companyName: true, paymentTermsDays: true },
      }),
      tx.companySettings.findFirst({ select: { vatRate: true, invoicePrefix: true } }),
    ]);
    if (!driver || !customer) {
      throw new Error("The selected driver or company is unavailable.");
    }

    let contract: { id: string; reference: string; title: string } | null = null;
    if (data.contractListingId) {
      contract = await tx.contractListing.findFirst({
        where: {
          id: data.contractListingId,
          customerId: data.customerId,
          awardedBid: { driverId: data.driverId },
        },
        select: { id: true, reference: true, title: true },
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
    const issueDate = data.completedAt;
    const dueDate = new Date(issueDate);
    dueDate.setUTCDate(dueDate.getUTCDate() + customer.paymentTermsDays);
    const vatRate = settings?.vatRate ?? 20;
    const vatAmount = data.income * vatRate / 100;
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber: `${settings?.invoicePrefix ?? "INV"}-${issueDate.toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`,
        customerId: customer.id,
        driverPerformanceEntryId: entry.id,
        status: "DRAFT",
        description: contract
          ? `Completed journey ${contract.reference}: ${contract.title}`
          : `Completed logistics journey for ${customer.companyName}`,
        issueDate,
        dueDate,
        subtotal: data.income,
        vatRate,
        vatAmount,
        total: data.income + vatAmount,
        amountPaid: 0,
        reference: contract?.reference,
        notes: `Automatic journey invoice. Internal costs: repairs £${data.repairCosts.toFixed(2)}, damage £${data.damageCosts.toFixed(2)}, other £${data.otherCosts.toFixed(2)}. Net operating profit before VAT: £${(data.income - data.expenditure).toFixed(2)}.`,
      },
    });
    if (contract) {
      await tx.contractListing.update({
        where: { id: contract.id },
        data: { status: "CLOSED", closedAt: data.completedAt },
      });
    }
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

    return { entry, driver: updatedDriver, invoice };
  });
}
