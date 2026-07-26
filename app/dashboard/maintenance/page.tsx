import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WorkOrderTable from "@/components/workshop/WorkOrderTable";
import WorkshopFilters from "@/components/workshop/WorkshopFilters";
import WorkshopStats from "@/components/workshop/WorkshopStats";
import { getWorkshopCentre } from "@/src/server/workshop/service";
import { maintenancePriorities, maintenanceStatuses, type MaintenancePriority, type MaintenanceStatus } from "@/src/server/workshop/types";

export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;

export default async function MaintenancePage({ searchParams }: { searchParams: Promise<{ search?: string | string[]; status?: string | string[]; priority?: string | string[] }> }) {
  const params = await searchParams;
  const status = one(params.status);
  const priority = one(params.priority);
  const workshop = await getWorkshopCentre({
    ...(one(params.search)?.trim() ? { search: one(params.search)!.trim() } : {}),
    ...(maintenanceStatuses.includes(status as MaintenanceStatus) ? { status: status as MaintenanceStatus } : {}),
    ...(maintenancePriorities.includes(priority as MaintenancePriority) ? { priority: priority as MaintenancePriority } : {}),
  });
  return <DashboardLayout title="Workshop & Maintenance Centre" subtitle="Control inspections, repairs, servicing and vehicle downtime.">
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-white">Workshop & Maintenance</h1><p className="mt-2 text-slate-400">Plan work, track costs and return safe vehicles to service.</p></div><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">v0.6.0</span><Link href="/dashboard/maintenance/new" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500">New work order</Link></div></div>
      <WorkshopStats stats={workshop.stats} />
      {workshop.vehicleIssues.length > 0 && <section className="rounded-xl border border-orange-500/20 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">Trucky vehicle condition feed</h2>
        <p className="mt-1 text-sm text-slate-400">Open damage, wearing-parts and service signals imported from completed jobs.</p>
        <div className="mt-4 overflow-x-auto"><table className="min-w-full text-sm">
          <thead className="border-b border-slate-800 text-left text-slate-500"><tr><th className="py-3 pr-4">Vehicle</th><th className="py-3 pr-4">Type</th><th className="py-3 pr-4">Component</th><th className="py-3 pr-4">Reading</th><th className="py-3">Status</th></tr></thead>
          <tbody className="divide-y divide-slate-800">{workshop.vehicleIssues.map((issue) => <tr key={issue.id} className="text-slate-300">
            <td className="py-3 pr-4"><Link className="text-blue-400" href={`/dashboard/fleet/${issue.truck.id}`}>{issue.truck.fleetNumber} · {issue.truck.registration}</Link></td>
            <td className="py-3 pr-4">{issue.kind}</td><td className="py-3 pr-4">{issue.component}</td>
            <td className="py-3 pr-4">{(issue.damagePercent ?? issue.wearPercent ?? 0).toFixed(1)}%</td><td className="py-3">{issue.status}</td>
          </tr>)}</tbody>
        </table></div>
      </section>}
      <WorkshopFilters /><WorkOrderTable jobs={workshop.jobs} />
    </div>
  </DashboardLayout>;
}
