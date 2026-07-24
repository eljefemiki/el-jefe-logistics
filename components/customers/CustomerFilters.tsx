"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CustomerFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    router.replace(`${pathname}?${next.toString()}`);
  };
  const input = "rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-violet-500";
  return <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_190px_auto]">
    <input aria-label="Search customers" placeholder="Search account, company, contact, email or city…" defaultValue={params.get("search") ?? ""} onChange={(event) => update("search", event.target.value)} className={input} />
    <select aria-label="Customer status" value={params.get("status") ?? ""} onChange={(event) => update("status", event.target.value)} className={input}><option value="">All statuses</option><option value="LEAD">Lead</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="INACTIVE">Inactive</option></select>
    <label className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-300"><input type="checkbox" checked={params.get("archived") === "true"} onChange={(event) => update("archived", event.target.checked ? "true" : "")} className="accent-violet-500" />Show archived</label>
  </div>;
}
