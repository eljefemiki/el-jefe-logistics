import { findInvoice, findInvoiceCustomers, findInvoices, insertInvoice, reviseInvoice } from "./repository";
import type { FinanceFilters, InvoiceInput } from "./types";
import { prisma } from "@/src/lib/prisma";
export async function getFinanceCentre(filters: FinanceFilters = {}) {
  const [invoices, allInvoices, journeys] = await Promise.all([
    findInvoices(filters),
    findInvoices(),
    prisma.driverPerformanceEntry.aggregate({ _sum: { income: true, expenditure: true } }),
  ]);
  const today = new Date(); const live = allInvoices.filter((invoice) => invoice.status !== "VOID");
  const overdue = live.filter((invoice) => invoice.status !== "PAID" && invoice.dueDate < today);
  const journeyIncome = journeys._sum.income ?? 0;
  const journeyCosts = journeys._sum.expenditure ?? 0;
  return { invoices, stats: {
    invoiced: live.reduce((sum, invoice) => sum + invoice.total, 0), collected: live.reduce((sum, invoice) => sum + invoice.amountPaid, 0),
    outstanding: live.reduce((sum, invoice) => sum + Math.max(0, invoice.total - invoice.amountPaid), 0),
    overdue: overdue.reduce((sum, invoice) => sum + Math.max(0, invoice.total - invoice.amountPaid), 0), overdueCount: overdue.length,
    journeyIncome, journeyCosts, journeyProfit: journeyIncome - journeyCosts,
  } };
}
export { findInvoice as getInvoice, findInvoiceCustomers as getInvoiceCustomers };
function invoiceNumber() { return `INV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${crypto.randomUUID().slice(0, 5).toUpperCase()}`; }
export function createInvoice(data: InvoiceInput) { return insertInvoice(invoiceNumber(), data); }
export function updateInvoice(id: string, data: InvoiceInput) { return reviseInvoice(id, data); }
