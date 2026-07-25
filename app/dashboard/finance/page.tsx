import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FinanceFilters from "@/components/finance/FinanceFilters";
import FinanceStats from "@/components/finance/FinanceStats";
import InvoiceTable from "@/components/finance/InvoiceTable";
import { getFinanceCentre, getInvoiceCustomers } from "@/src/server/finance/service";
import { invoiceStatuses, type InvoiceStatus } from "@/src/server/finance/types";
export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
export default async function FinancePage({ searchParams }: { searchParams: Promise<{ search?: string | string[]; status?: string | string[]; customerId?: string | string[] }> }) {
  const params = await searchParams; const status = one(params.status); const customerId = one(params.customerId); const customers = await getInvoiceCustomers();
  const centre = await getFinanceCentre({ ...(one(params.search)?.trim() ? { search: one(params.search)!.trim() } : {}), ...(invoiceStatuses.includes(status as InvoiceStatus) ? { status: status as InvoiceStatus } : {}), ...(customerId && customers.some((customer) => customer.id === customerId) ? { customerId } : {}) });
  return <DashboardLayout title="Finance Centre" subtitle="Control customer billing, cash collection and overdue exposure."><div className="mx-auto max-w-7xl space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-white">Finance Centre</h1><p className="mt-2 text-slate-400">Turn completed work into cash and keep every balance visible.</p></div><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">v0.9.0</span><Link href="/dashboard/finance/new" className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500">New invoice</Link></div></div>
    <FinanceStats stats={centre.stats} /><FinanceFilters customers={customers} /><InvoiceTable invoices={centre.invoices} />
  </div></DashboardLayout>;
}
