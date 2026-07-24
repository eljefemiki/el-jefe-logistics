"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function WorkshopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const current = useSearchParams();
  function set(name: string, value: string) {
    const params = new URLSearchParams(current.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.push(`${pathname}?${params.toString()}`);
  }
  const classes = "rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500";
  return <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_220px_180px]">
    <input aria-label="Search work orders" placeholder="Search job, truck or registration…" defaultValue={current.get("search") ?? ""} onChange={(event) => set("search", event.target.value)} className={classes} />
    <select aria-label="Filter by status" value={current.get("status") ?? ""} onChange={(event) => set("status", event.target.value)} className={classes}>
      <option value="">All statuses</option><option value="REPORTED">Reported</option><option value="SCHEDULED">Scheduled</option><option value="IN_PROGRESS">In progress</option><option value="WAITING_PARTS">Waiting parts</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
    </select>
    <select aria-label="Filter by priority" value={current.get("priority") ?? ""} onChange={(event) => set("priority", event.target.value)} className={classes}>
      <option value="">All priorities</option><option value="CRITICAL">Critical</option><option value="HIGH">High</option><option value="ROUTINE">Routine</option><option value="LOW">Low</option>
    </select>
  </div>;
}
