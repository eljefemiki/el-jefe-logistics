import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FuelFilters from "@/components/fuel/FuelFilters";
import FuelStats from "@/components/fuel/FuelStats";
import FuelTable from "@/components/fuel/FuelTable";
import { getFuelCentre, getFuelTrucks } from "@/src/server/fuel/service";
import { fuelTypes, type FuelType } from "@/src/server/fuel/types";

export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;

export default async function FuelPage({ searchParams }: { searchParams: Promise<{ search?: string | string[]; fuelType?: string | string[]; truckId?: string | string[] }> }) {
  const params = await searchParams;
  const fuelType = one(params.fuelType);
  const trucks = await getFuelTrucks();
  const truckId = one(params.truckId);
  const centre = await getFuelCentre({
    ...(one(params.search)?.trim() ? { search: one(params.search)!.trim() } : {}),
    ...(fuelTypes.includes(fuelType as FuelType) ? { fuelType: fuelType as FuelType } : {}),
    ...(truckId && trucks.some((truck) => truck.id === truckId) ? { truckId } : {}),
  });
  return <DashboardLayout title="Fuel Centre" subtitle="Track fleet energy, refuelling activity and operating cost."><div className="mx-auto max-w-7xl space-y-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-white">Fuel Centre</h1><p className="mt-2 text-slate-400">Control every fill-up, supplier charge and vehicle fuel update.</p></div><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">v0.7.0</span><Link href="/dashboard/fuel/new" className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500">Record fuel</Link></div></div>
    <FuelStats stats={centre.stats} /><FuelFilters trucks={trucks} /><FuelTable entries={centre.entries} />
  </div></DashboardLayout>;
}
