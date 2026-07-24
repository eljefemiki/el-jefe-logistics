import { prisma } from "@/src/lib/prisma";
import type { CustomerFilters, CustomerInput } from "./types";

export function findCustomers(filters: CustomerFilters = {}) {
  return prisma.customer.findMany({
    where: {
      ...(filters.includeArchived ? {} : { archivedAt: null }),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search ? {
        OR: [
          { customerNumber: { contains: filters.search, mode: "insensitive" } },
          { companyName: { contains: filters.search, mode: "insensitive" } },
          { contactFirstName: { contains: filters.search, mode: "insensitive" } },
          { contactLastName: { contains: filters.search, mode: "insensitive" } },
          { email: { contains: filters.search, mode: "insensitive" } },
          { city: { contains: filters.search, mode: "insensitive" } },
        ],
      } : {}),
    },
    orderBy: [{ archivedAt: "asc" }, { companyName: "asc" }],
  });
}

export function findCustomer(id: string) {
  return prisma.customer.findUnique({ where: { id } });
}

export function insertCustomer(customerNumber: string, data: CustomerInput) {
  return prisma.customer.create({ data: { ...data, customerNumber } });
}

export function reviseCustomer(id: string, data: CustomerInput) {
  return prisma.customer.update({ where: { id }, data });
}

export function setCustomerArchived(id: string, archived: boolean) {
  return prisma.customer.update({
    where: { id },
    data: { archivedAt: archived ? new Date() : null },
  });
}
