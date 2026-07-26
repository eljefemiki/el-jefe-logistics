import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FuelEntryForm from "@/components/fuel/FuelEntryForm";
import { getFuelEntry, getFuelTrucks } from "@/src/server/fuel/service";

export const dynamic = "force-dynamic";
export default async function EditFuelEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getFuelEntry(id);
  if (!entry) notFound();
  const trucks = await getFuelTrucks(entry.truckId);
  return <DashboardLayout title="Edit fuel entry" subtitle={entry.reference}><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-bold text-white">Edit fuel entry</h1><p className="mb-8 mt-2 text-slate-400">{entry.reference} · {entry.truck.fleetNumber}</p><FuelEntryForm trucks={trucks} entry={entry} /></div></DashboardLayout>;
}
