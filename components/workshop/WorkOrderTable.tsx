import Link from "next/link";
import { ClipboardList } from "lucide-react";

type Job = Awaited<ReturnType<typeof import("@/src/server/workshop/service").getWorkshopCentre>>["jobs"][number];
const labels: Record<string, string> = { REPORTED: "Reported", SCHEDULED: "Scheduled", IN_PROGRESS: "In progress", WAITING_PARTS: "Waiting parts", COMPLETED: "Completed", CANCELLED: "Cancelled" };
const badge: Record<string, string> = { CRITICAL: "bg-red-500/10 text-red-300", HIGH: "bg-amber-500/10 text-amber-300", ROUTINE: "bg-blue-500/10 text-blue-300", LOW: "bg-slate-700 text-slate-300" };

export default function WorkOrderTable({ jobs }: { jobs: Job[] }) {
  if (!jobs.length) return <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center"><ClipboardList className="mx-auto h-9 w-9 text-slate-500" /><h2 className="mt-4 font-semibold text-white">No work orders found</h2><p className="mt-2 text-sm text-slate-400">Create a work order or adjust the current filters.</p></div>;
  return <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"><div className="overflow-x-auto"><table className="w-full text-left text-sm">
    <thead className="border-b border-slate-800 bg-slate-950 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Work order</th><th className="px-5 py-4">Vehicle</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Priority</th><th className="px-5 py-4">Scheduled</th><th className="px-5 py-4 text-right">Estimate</th></tr></thead>
    <tbody className="divide-y divide-slate-800">{jobs.map((job) => <tr key={job.id} className="hover:bg-slate-800/40">
      <td className="px-5 py-4"><Link href={`/dashboard/maintenance/${job.id}`} className="font-semibold text-white hover:text-blue-400">{job.jobNumber}</Link><p className="mt-1 text-slate-400">{job.title}</p></td>
      <td className="px-5 py-4 text-white">{job.truck.fleetNumber}<p className="mt-1 text-xs text-slate-500">{job.truck.registration}</p></td>
      <td className="px-5 py-4 text-slate-300">{labels[job.status]}</td>
      <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[job.priority]}`}>{job.priority.toLowerCase()}</span></td>
      <td className="px-5 py-4 text-slate-400">{job.scheduledFor ? job.scheduledFor.toLocaleDateString("en-GB") : "Unscheduled"}</td>
      <td className="px-5 py-4 text-right text-slate-300">{job.estimatedCost == null ? "—" : `£${job.estimatedCost.toLocaleString("en-GB")}`}</td>
    </tr>)}</tbody>
  </table></div></div>;
}
