import { prisma } from "@/src/lib/prisma";
import type { FinanceFilters, InvoiceInput } from "./types";
const include = { customer: { select: { id: true, customerNumber: true, companyName: true, billingEmail: true, email: true } } } as const;
export function findInvoices(filters: FinanceFilters = {}) {
  return prisma.invoice.findMany({ where: {
    ...(filters.status ? { status: filters.status } : {}), ...(filters.customerId ? { customerId: filters.customerId } : {}),
    ...(filters.search ? { OR: [
      { invoiceNumber: { contains: filters.search, mode: "insensitive" } }, { description: { contains: filters.search, mode: "insensitive" } },
      { reference: { contains: filters.search, mode: "insensitive" } }, { customer: { companyName: { contains: filters.search, mode: "insensitive" } } },
    ] } : {}),
  }, include, orderBy: { issueDate: "desc" } });
}
export function findInvoice(id: string) { return prisma.invoice.findUnique({ where: { id }, include }); }
export function findInvoiceCustomers() { return prisma.customer.findMany({ where: { archivedAt: null, status: { in: ["ACTIVE", "ON_HOLD"] } }, select: { id: true, customerNumber: true, companyName: true, paymentTermsDays: true }, orderBy: { companyName: "asc" } }); }
function totals(data: InvoiceInput) { const vatAmount = data.subtotal * data.vatRate / 100; return { vatAmount, total: data.subtotal + vatAmount }; }
export function insertInvoice(invoiceNumber: string, data: InvoiceInput) { return prisma.invoice.create({ data: { ...data, ...totals(data), invoiceNumber }, include }); }
export function reviseInvoice(id: string, data: InvoiceInput) { return prisma.invoice.update({ where: { id }, data: { ...data, ...totals(data) }, include }); }
