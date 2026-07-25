"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function MarketplaceFilters() {
  const router = useRouter(); const pathname = usePathname(); const current = useSearchParams();
  const set = (key: string, value: string) => { const params = new URLSearchParams(current); if (value) params.set(key, value); else params.delete(key); router.replace(`${pathname}?${params}`); };
  const classes = "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500";
  return <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:flex-row"><input aria-label="Search contracts" defaultValue={current.get("search") ?? ""} onChange={(event) => set("search", event.target.value)} placeholder="Search route, customer or reference…" className={`min-w-0 flex-1 ${classes}`} /><select aria-label="Contract status" value={current.get("status") ?? ""} onChange={(event) => set("status", event.target.value)} className={classes}><option value="">All statuses</option><option value="DRAFT">Draft</option><option value="OPEN">Open</option><option value="AWARDED">Awarded</option><option value="CLOSED">Closed</option><option value="CANCELLED">Cancelled</option></select></div>;
}
