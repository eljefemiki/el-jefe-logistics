"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function FuelFilters({ trucks }: { trucks: { id: string; fleetNumber: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const update = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(name, value);
    else next.delete(name);
    router.replace(`${pathname}?${next.toString()}`);
  };
  const input = "rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-cyan-500";
  return <div className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-[1fr_180px_180px]">
    <input aria-label="Search fuel entries" placeholder="Search reference, station, receipt or vehicle…" defaultValue={params.get("search") ?? ""} onChange={(event) => update("search", event.target.value)} className={input} />
    <select aria-label="Fuel type" value={params.get("fuelType") ?? ""} onChange={(event) => update("fuelType", event.target.value)} className={input}><option value="">All fuel types</option><option value="DIESEL">Diesel</option><option value="HVO">HVO</option><option value="ADBLUE">AdBlue</option><option value="ELECTRIC">Electric</option><option value="OTHER">Other</option></select>
    <select aria-label="Vehicle" value={params.get("truckId") ?? ""} onChange={(event) => update("truckId", event.target.value)} className={input}><option value="">All vehicles</option>{trucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.fleetNumber}</option>)}</select>
  </div>;
}
