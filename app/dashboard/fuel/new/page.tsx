import DashboardLayout from "@/components/layout/DashboardLayout";
import FuelEntryForm from "@/components/fuel/FuelEntryForm";
import { getFuelTrucks } from "@/src/server/fuel/service";

export const dynamic = "force-dynamic";
export default async function NewFuelEntryPage() {
  const trucks = await getFuelTrucks();
  return <DashboardLayout title="Record fuel" subtitle="Add a fleet fuel or energy transaction."><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">Record fuel</h1><p className="mb-8 mt-2 text-slate-400">The vehicle mileage and optional fuel level will be updated automatically.</p><FuelEntryForm trucks={trucks} /></div></DashboardLayout>;
}
