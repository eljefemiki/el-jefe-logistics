import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkOrderForm from "@/components/workshop/WorkOrderForm";
import { getMaintenanceJob, getWorkshopTrucks } from "@/src/server/workshop/service";

export const dynamic = "force-dynamic";
export default async function EditMaintenanceJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getMaintenanceJob(id);
  if (!job) notFound();
  const trucks = await getWorkshopTrucks(job.truckId);
  return <DashboardLayout title={`Edit ${job.jobNumber}`} subtitle={job.title}><div className="mx-auto max-w-5xl"><h1 className="mb-8 text-3xl font-bold text-white">Edit work order</h1><WorkOrderForm trucks={trucks} job={job} /></div></DashboardLayout>;
}
