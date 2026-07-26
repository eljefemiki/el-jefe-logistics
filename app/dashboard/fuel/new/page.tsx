import DashboardLayout from "@/components/layout/DashboardLayout";
import FuelEntryForm from "@/components/fuel/FuelEntryForm";
import { getFuelTrucks } from "@/src/server/fuel/service";

export const dynamic = "force-dynamic";
export default async function NewFuelEntryPage({ searchParams }: { searchParams: Promise<{ truckId?: string | string[] }> }) {
  const params = await searchParams;
  const requestedTruckId = Array.isArray(params.truckId) ? params.truckId[0] : params.truckId;
  const trucks = await getFuelTrucks();
  const selectedTruckId = trucks.some((truck) => truck.id === requestedTruckId) ? requestedTruckId : undefined;
  return <DashboardLayout title="Record fuel" subtitle="Add a fleet fuel or energy transaction."><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">Record fuel</h1><p className="mb-8 mt-2 text-slate-400">The latest transaction updates the vehicle odometer and optional fuel level without allowing historical entries to move the odometer backwards.</p><FuelEntryForm trucks={trucks} selectedTruckId={selectedTruckId} /></div></DashboardLayout>;
}
