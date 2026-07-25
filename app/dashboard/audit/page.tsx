import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { getAuditEvents } from "@/src/server/platform/audit";
export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
export default async function AuditPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  await requirePermission("audit:view"); const q = one((await searchParams).q)?.trim(); const events = await getAuditEvents(q);
  return <DashboardLayout title="Audit Centre" subtitle="Searchable record of critical platform activity."><div className="space-y-6"><form><input name="q" defaultValue={q} placeholder="Search action, summary or entity…" className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" /></form>
    <div className="overflow-x-auto rounded-xl border border-slate-800"><table className="w-full text-left text-sm"><thead className="bg-slate-900 text-slate-400"><tr><th className="p-4">Time</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Entity</th><th className="p-4">Summary</th></tr></thead><tbody className="divide-y divide-slate-800">{events.map(event => <tr key={event.id}><td className="whitespace-nowrap p-4 text-slate-400">{event.createdAt.toLocaleString("en-GB")}</td><td className="p-4 text-slate-300">{event.actor ? `${event.actor.firstName} ${event.actor.lastName}` : "System"}</td><td className="p-4 font-medium text-blue-300">{event.action}</td><td className="p-4 text-slate-300">{event.entityType}{event.entityId ? ` · ${event.entityId}` : ""}</td><td className="p-4 text-slate-300">{event.summary}</td></tr>)}</tbody></table>{events.length === 0 && <p className="p-10 text-center text-slate-500">No audit events found.</p>}</div>
  </div></DashboardLayout>;
}
