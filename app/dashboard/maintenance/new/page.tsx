import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkOrderForm from "@/components/workshop/WorkOrderForm";
import { getWorkshopTrucks } from "@/src/server/workshop/service";

export const dynamic = "force-dynamic";
export default async function NewMaintenanceJobPage({ searchParams }: { searchParams: Promise<{ truckId?: string | string[] }> }) {
  const params = await searchParams;
  const requestedTruckId = Array.isArray(params.truckId) ? params.truckId[0] : params.truckId;
  const trucks = await getWorkshopTrucks();
  const selectedTruckId = trucks.some((truck) => truck.id === requestedTruckId) ? requestedTruckId : undefined;
  return <DashboardLayout title="New work order" subtitle="Open a tracked maintenance job."><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">New work order</h1><p className="mt-2 mb-8 text-slate-400">The selected truck will move into maintenance while this job remains open.</p><WorkOrderForm trucks={trucks} selectedTruckId={selectedTruckId} /></div></DashboardLayout>;
}
