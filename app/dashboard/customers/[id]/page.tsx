import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CustomerArchiveButton from "@/components/customers/CustomerArchiveButton";
import CustomerStatusBadge from "@/components/customers/CustomerStatusBadge";
import { getCustomer } from "@/src/server/customers/service";

export const dynamic = "force-dynamic";
const money = (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();
  const address = [customer.addressLine1, customer.addressLine2, customer.city, customer.postcode, customer.country].filter(Boolean);
  const rows = [
    ["Account number", customer.customerNumber],
    ["Company", customer.companyName],
    ["Primary contact", `${customer.contactFirstName} ${customer.contactLastName}`],
    ["Contact email", customer.email],
    ["Phone", customer.phone ?? "Not recorded"],
    ["Billing email", customer.billingEmail ?? customer.email],
    ["Credit limit", customer.creditLimit === null ? "Not set" : money(customer.creditLimit)],
    ["Payment terms", `${customer.paymentTermsDays} days`],
    ["Address", address.join(", ") || "Not recorded"],
    ["Customer since", new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(customer.createdAt)],
  ];
  return <DashboardLayout title={customer.companyName} subtitle="Customer relationship record."><div className="mx-auto max-w-5xl space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><Link href="/dashboard/customers" className="text-sm text-violet-400 hover:text-violet-300">← Customer CRM</Link><div className="mt-2 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold text-white">{customer.companyName}</h1><CustomerStatusBadge status={customer.status} />{customer.archivedAt && <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">Archived</span>}</div><p className="mt-2 text-slate-400">{customer.customerNumber}</p></div><div className="flex flex-wrap gap-3"><CustomerArchiveButton id={customer.id} archived={Boolean(customer.archivedAt)} /><Link href={`/dashboard/customers/${customer.id}/edit`} className="rounded-lg bg-violet-600 px-4 py-2 text-center font-medium text-white hover:bg-violet-500">Edit customer</Link></div></div>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Account overview</h2><dl className="mt-4 grid gap-x-8 md:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="border-b border-slate-800 py-4"><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-medium text-slate-200">{value}</dd></div>)}</dl>{customer.notes && <div className="mt-6 rounded-lg bg-slate-950 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Relationship notes</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{customer.notes}</p></div>}</section>
  </div></DashboardLayout>;
}
