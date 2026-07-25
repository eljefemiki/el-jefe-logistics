import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InvoiceForm from "@/components/finance/InvoiceForm";
import { getInvoiceCustomers } from "@/src/server/finance/service";
export const dynamic = "force-dynamic";
export default async function NewInvoicePage() {
  const customers = await getInvoiceCustomers();
  return <DashboardLayout title="New invoice" subtitle="Create a customer invoice."><div className="mx-auto max-w-4xl space-y-8"><div><Link href="/dashboard/finance" className="text-sm text-violet-400 hover:text-violet-300">← Finance Centre</Link><h1 className="mt-2 text-3xl font-bold text-white">New invoice</h1><p className="mt-2 text-slate-400">Record the charge, tax, payment terms and customer reference.</p></div>{customers.length ? <InvoiceForm customers={customers} /> : <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-amber-200">Create or activate a customer before raising an invoice.</div>}</div></DashboardLayout>;
}
