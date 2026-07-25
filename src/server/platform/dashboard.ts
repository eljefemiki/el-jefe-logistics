import "server-only";
import { prisma } from "@/src/lib/prisma";
export async function getExecutiveDashboard() {
  const now = new Date();
  const [trucks, available, driversWorking, workshopQueue, fuel, invoices, overdueInvoices] = await Promise.all([
    prisma.truck.count(), prisma.truck.count({ where: { status: "AVAILABLE" } }),
    prisma.driver.count({ where: { archivedAt: null, status: { in: ["DRIVING", "AVAILABLE"] } } }),
    prisma.maintenanceJob.count({ where: { status: { in: ["REPORTED", "SCHEDULED", "IN_PROGRESS", "WAITING_PARTS"] } } }),
    prisma.fuelEntry.aggregate({ _sum: { totalCost: true } }),
    prisma.invoice.findMany({ where: { status: { not: "VOID" } }, select: { amountPaid: true } }),
    prisma.invoice.count({ where: { dueDate: { lt: now }, status: { notIn: ["PAID", "VOID"] } } }),
  ]);
  const revenue = invoices.reduce((sum, invoice) => sum + invoice.amountPaid, 0);
  const fuelSpend = fuel._sum.totalCost ?? 0;
  return { revenue, profit: revenue - fuelSpend, fleetAvailability: trucks ? Math.round(available / trucks * 100) : 0, activeJobs: 0, driversWorking, fuelSpend, workshopQueue, delayedJobs: 0, overdueInvoices };
}
