import "server-only";
import { prisma } from "@/src/lib/prisma";
export async function globalSearch(query: string) {
  const q = query.trim(); if (q.length < 2) return [];
  const [trucks, drivers, customers, invoices, maintenance, fuel] = await Promise.all([
    prisma.truck.findMany({ where: { OR: [{ fleetNumber: { contains: q, mode: "insensitive" } }, { registration: { contains: q, mode: "insensitive" } }, { model: { contains: q, mode: "insensitive" } }] }, select: { id: true, fleetNumber: true, registration: true }, take: 6 }),
    prisma.driver.findMany({ where: { archivedAt: null, OR: [{ employeeNumber: { contains: q, mode: "insensitive" } }, { callsign: { contains: q, mode: "insensitive" } }, { account: { is: { OR: [{ firstName: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }] } } }] }, select: { id: true, employeeNumber: true, callsign: true, account: { select: { firstName: true, lastName: true } } }, take: 6 }),
    prisma.customer.findMany({ where: { archivedAt: null, OR: [{ customerNumber: { contains: q, mode: "insensitive" } }, { companyName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }, select: { id: true, customerNumber: true, companyName: true }, take: 6 }),
    prisma.invoice.findMany({ where: { OR: [{ invoiceNumber: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { customer: { companyName: { contains: q, mode: "insensitive" } } }] }, select: { id: true, invoiceNumber: true, description: true }, take: 6 }),
    prisma.maintenanceJob.findMany({ where: { OR: [{ jobNumber: { contains: q, mode: "insensitive" } }, { title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }, select: { id: true, jobNumber: true, title: true }, take: 6 }),
    prisma.fuelEntry.findMany({ where: { OR: [{ reference: { contains: q, mode: "insensitive" } }, { station: { contains: q, mode: "insensitive" } }, { receiptNumber: { contains: q, mode: "insensitive" } }] }, select: { id: true, reference: true, station: true }, take: 6 }),
  ]);
  return [
    { group: "Trucks", items: trucks.map(x => ({ id: x.id, title: x.fleetNumber, detail: x.registration, href: `/dashboard/fleet/${x.id}` })) },
    { group: "Drivers", items: drivers.map(x => ({ id: x.id, title: `${x.account.firstName} ${x.account.lastName}`, detail: x.callsign || x.employeeNumber, href: `/dashboard/drivers/${x.id}` })) },
    { group: "Customers", items: customers.map(x => ({ id: x.id, title: x.companyName, detail: x.customerNumber, href: `/dashboard/customers/${x.id}` })) },
    { group: "Invoices", items: invoices.map(x => ({ id: x.id, title: x.invoiceNumber, detail: x.description, href: `/dashboard/finance/${x.id}` })) },
    { group: "Jobs & maintenance", items: maintenance.map(x => ({ id: x.id, title: x.jobNumber, detail: x.title, href: `/dashboard/maintenance/${x.id}` })) },
    { group: "Fuel", items: fuel.map(x => ({ id: x.id, title: x.reference, detail: x.station, href: `/dashboard/fuel/${x.id}` })) },
  ].filter(group => group.items.length);
}
