import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getMaintenanceJob } from "@/src/server/workshop/service";

export const dynamic = "force-dynamic";
const words = (value: string) => value.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
export default async function MaintenanceJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getMaintenanceJob(id);
  if (!job) notFound();
  const rows = [["Vehicle", `${job.truck.fleetNumber} · ${job.truck.registration}`], ["Type", words(job.type)], ["Status", words(job.status)], ["Priority", words(job.priority)], ["Technician", job.technician ?? "Unassigned"], ["Vendor", job.vendor ?? "Internal workshop"], ["Scheduled", job.scheduledFor?.toLocaleDateString("en-GB") ?? "Unscheduled"], ["Odometer", job.odometerKm == null ? "Not recorded" : `${job.odometerKm.toLocaleString("en-GB")} km`], ["Estimate", job.estimatedCost == null ? "Not recorded" : `£${job.estimatedCost.toLocaleString("en-GB")}`], ["Actual cost", job.actualCost == null ? "Not recorded" : `£${job.actualCost.toLocaleString("en-GB")}`]];
  return <DashboardLayout title={job.jobNumber} subtitle={job.title}><div className="mx-auto max-w-5xl space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-blue-400">{job.jobNumber}</p><h1 className="mt-1 text-3xl font-bold text-white">{job.title}</h1></div><Link href={`/dashboard/maintenance/${job.id}/edit`} className="rounded-lg bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-500">Edit work order</Link></div>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rows.map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-xs uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 font-medium text-white">{value}</p></div>)}</section>
    {(job.description || job.notes) && <section className="grid gap-6 lg:grid-cols-2">{job.description && <div className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold text-white">Description</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">{job.description}</p></div>}{job.notes && <div className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="font-semibold text-white">Workshop notes</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-400">{job.notes}</p></div>}</section>}
  </div></DashboardLayout>;
}
