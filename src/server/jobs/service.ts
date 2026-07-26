import "server-only";
import { prisma } from "@/src/lib/prisma";

export async function getJobs(search?: string, driverId?: string) {
  return prisma.transportJob.findMany({
    where: {
      ...(driverId ? { driverId } : {}),
      ...(search ? { OR: [
        { cargo: { contains: search, mode: "insensitive" } },
        { sourceCity: { contains: search, mode: "insensitive" } },
        { destinationCity: { contains: search, mode: "insensitive" } },
        { driver: { account: { firstName: { contains: search, mode: "insensitive" } } } },
        { driver: { account: { lastName: { contains: search, mode: "insensitive" } } } },
      ] } : {}),
    },
    include: {
      driver: { include: { account: { select: { firstName: true, lastName: true } } } },
      truck: { select: { fleetNumber: true, registration: true } },
      invoice: { select: { id: true, invoiceNumber: true, status: true } },
    },
    orderBy: [{ completedAt: "desc" }, { startedAt: "desc" }],
    take: 250,
  });
}

export async function getJobDashboard() {
  const [completed, active, aggregates, uninvoiced, sync] = await Promise.all([
    prisma.transportJob.count({ where: { status: "COMPLETED" } }),
    prisma.transportJob.count({ where: { status: "STARTED" } }),
    prisma.transportJob.aggregate({ where: { status: "COMPLETED" }, _sum: { revenue: true, profit: true, drivenDistanceKm: true } }),
    prisma.transportJob.count({ where: { status: "COMPLETED", invoice: null } }),
    prisma.truckySyncState.findUnique({ where: { id: "company" } }),
  ]);
  return { completed, active, uninvoiced, revenue: aggregates._sum.revenue ?? 0, profit: aggregates._sum.profit ?? 0, distanceKm: aggregates._sum.drivenDistanceKm ?? 0, sync };
}
