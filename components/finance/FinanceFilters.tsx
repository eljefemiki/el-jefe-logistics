"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function FinanceFilters({ customers }: { customers: { id: string; companyName: string }[] }) {
  const router = useRouter(); const pathname = usePathname(); const current = useSearchParams();
  const update = (name: string, value: string) => { const params = new URLSearchParams(current); if (value) params.set(name, value); else params.delete(name); router.replace(`${pathname}?${params.toString()}`); };
  const control = "rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500";
  return <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_180px_240px]">
    <input aria-label="Search invoices" defaultValue={current.get("search") ?? ""} onChange={(event) => update("search", event.target.value)} placeholder="Search invoice, customer or reference…" className={control} />
    <select aria-label="Status" value={current.get("status") ?? ""} onChange={(event) => update("status", event.target.value)} className={control}><option value="">All statuses</option><option value="DRAFT">Draft</option><option value="SENT">Sent</option><option value="PART_PAID">Part paid</option><option value="PAID">Paid</option><option value="OVERDUE">Overdue</option><option value="VOID">Void</option></select>
    <select aria-label="Customer" value={current.get("customerId") ?? ""} onChange={(event) => update("customerId", event.target.value)} className={control}><option value="">All customers</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.companyName}</option>)}</select>
  </div>;
}
