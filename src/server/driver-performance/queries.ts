import { prisma } from "@/src/lib/prisma";

export async function getDriverPerformance(driverId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);

  const [allTime, lastThirtyDays, companyGroups, recentEntries] =
    await Promise.all([
      prisma.driverPerformanceEntry.aggregate({
        where: { driverId },
        _sum: {
          distanceKm: true,
          cargoTonnes: true,
          income: true,
          expenditure: true,
        },
        _avg: { reputationScore: true },
        _count: true,
      }),
      prisma.driverPerformanceEntry.aggregate({
        where: { driverId, completedAt: { gte: thirtyDaysAgo } },
        _sum: {
          distanceKm: true,
          cargoTonnes: true,
          income: true,
          expenditure: true,
        },
        _count: true,
      }),
      prisma.driverPerformanceEntry.groupBy({
        by: ["customerId"],
        where: { driverId },
        _avg: { reputationScore: true },
        _count: true,
        orderBy: { _count: { customerId: "desc" } },
      }),
      prisma.driverPerformanceEntry.findMany({
        where: { driverId },
        include: {
          customer: { select: { companyName: true } },
          contractListing: { select: { reference: true } },
        },
        orderBy: { completedAt: "desc" },
        take: 8,
      }),
    ]);

  const customers = companyGroups.length
    ? await prisma.customer.findMany({
        where: { id: { in: companyGroups.map((group) => group.customerId) } },
        select: { id: true, companyName: true },
      })
    : [];
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.companyName]),
  );

  const income = allTime._sum.income ?? 0;
  const expenditure = allTime._sum.expenditure ?? 0;
  const recentIncome = lastThirtyDays._sum.income ?? 0;
  const recentExpenditure = lastThirtyDays._sum.expenditure ?? 0;

  return {
    allTime: {
      distanceKm: allTime._sum.distanceKm ?? 0,
      cargoTonnes: allTime._sum.cargoTonnes ?? 0,
      income,
      expenditure,
      profit: income - expenditure,
      deliveries: allTime._count,
      reputation: allTime._avg.reputationScore,
    },
    lastThirtyDays: {
      distanceKm: lastThirtyDays._sum.distanceKm ?? 0,
      cargoTonnes: lastThirtyDays._sum.cargoTonnes ?? 0,
      income: recentIncome,
      expenditure: recentExpenditure,
      profit: recentIncome - recentExpenditure,
      deliveries: lastThirtyDays._count,
    },
    companyReputation: companyGroups.map((group) => ({
      customerId: group.customerId,
      companyName: customerNames.get(group.customerId) ?? "Unknown company",
      reputation: group._avg.reputationScore ?? 0,
      deliveries: group._count,
    })),
    recentEntries,
  };
}

export function getPerformanceEntryOptions(driverId: string) {
  return Promise.all([
    prisma.customer.findMany({
      where: { archivedAt: null, status: "ACTIVE" },
      select: { id: true, companyName: true },
      orderBy: { companyName: "asc" },
    }),
    prisma.contractListing.findMany({
      where: {
        awardedBid: { driverId },
        performanceEntry: null,
      },
      select: {
        id: true,
        reference: true,
        customerId: true,
        weightKg: true,
        budget: true,
      },
      orderBy: { awardedAt: "desc" },
    }),
  ]);
}
