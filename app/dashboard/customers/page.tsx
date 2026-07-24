import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerFilters from "@/components/customers/CustomerFilters";
import CustomerStats from "@/components/customers/CustomerStats";
import CustomerTable from "@/components/customers/CustomerTable";
import { getCustomerCRM } from "@/src/server/customers/service";
import { customerStatuses, type CustomerStatus } from "@/src/server/customers/types";

export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ search?: string | string[]; status?: string | string[]; archived?: string | string[] }> }) {
  const params = await searchParams;
  const status = one(params.status);
  const crm = await getCustomerCRM({
    ...(one(params.search)?.trim() ? { search: one(params.search)!.trim() } : {}),
    ...(customerStatuses.includes(status as CustomerStatus) ? { status: status as CustomerStatus } : {}),
    includeArchived: one(params.archived) === "true",
  });
  return <DashboardLayout title="Customer CRM" subtitle="Manage customer relationships, contacts and commercial accounts."><div className="mx-auto max-w-7xl space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-white">Customer CRM</h1><p className="mt-2 text-slate-400">Keep customer contacts, account status and credit terms ready for dispatch.</p></div><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">v0.8.0</span><Link href="/dashboard/customers/new" className="rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-500">Add customer</Link></div></div>
    <CustomerStats stats={crm.stats} /><CustomerFilters /><CustomerTable customers={crm.customers} />
  </div></DashboardLayout>;
}
