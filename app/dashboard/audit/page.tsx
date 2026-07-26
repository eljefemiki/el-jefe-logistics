import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { getAuditEvents, getAuditFilterOptions } from "@/src/server/platform/audit";

export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
const validDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission("audit:view");
  const params = await searchParams;
  const search = one(params.q)?.trim();
  const action = one(params.action);
  const entityType = one(params.entityType);
  const from = validDate(one(params.from));
  const toStart = validDate(one(params.to));
  const to = toStart ? new Date(toStart.getTime() + 86_399_999) : undefined;
  const pageValue = Number(one(params.page));
  const [{ events, total, page, totalPages }, options] = await Promise.all([
    getAuditEvents({
      search,
      action,
      entityType,
      from,
      to,
      page: Number.isInteger(pageValue) ? pageValue : 1,
    }),
    getAuditFilterOptions(),
  ]);
  const pageHref = (nextPage: number) => {
    const query = new URLSearchParams();
    for (const name of ["q", "action", "entityType", "from", "to"]) {
      const value = one(params[name]);
      if (value) query.set(name, value);
    }
    query.set("page", String(nextPage));
    return `/dashboard/audit?${query}`;
  };

  return (
    <DashboardLayout title="Audit Centre" subtitle="Searchable, tamper-resistant record of critical platform activity.">
      <div className="space-y-6">
        <form className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-2 xl:grid-cols-6">
          <input name="q" defaultValue={search} placeholder="Search actor, action, summary or entity…" className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white xl:col-span-2" />
          <select name="action" defaultValue={action ?? ""} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white">
            <option value="">All actions</option>
            {options.actions.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <select name="entityType" defaultValue={entityType ?? ""} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white">
            <option value="">All entities</option>
            {options.entityTypes.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <input aria-label="From date" name="from" type="date" defaultValue={one(params.from)} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
          <input aria-label="To date" name="to" type="date" defaultValue={one(params.to)} className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white" />
          <div className="flex gap-3 md:col-span-2 xl:col-span-6">
            <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-500">Apply filters</button>
            <Link href="/dashboard/audit" className="rounded-lg border border-slate-700 px-5 py-2.5 text-slate-300 hover:bg-slate-800">Clear</Link>
            <span className="ml-auto self-center text-sm text-slate-400">{total.toLocaleString("en-GB")} events</span>
          </div>
        </form>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400"><tr><th className="p-4">Time</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Entity</th><th className="p-4">Summary and evidence</th></tr></thead>
            <tbody className="divide-y divide-slate-800">{events.map((event) => (
              <tr key={event.id} className="align-top">
                <td className="whitespace-nowrap p-4 text-slate-400">{event.createdAt.toLocaleString("en-GB")}</td>
                <td className="p-4 text-slate-300">{event.actor ? <>{event.actor.firstName} {event.actor.lastName}<span className="block text-xs text-slate-500">{event.actor.role}</span></> : "System"}</td>
                <td className="p-4 font-medium text-blue-300">{event.action}</td>
                <td className="p-4 text-slate-300">{event.entityType}{event.entityId ? <span className="block max-w-48 truncate text-xs text-slate-500" title={event.entityId}>{event.entityId}</span> : null}</td>
                <td className="min-w-80 p-4 text-slate-300">
                  {event.summary}
                  <div className="mt-1 text-xs text-slate-500">{event.ipAddress ?? "IP unavailable"}{event.userAgent ? ` · ${event.userAgent}` : ""}</div>
                  {(event.before !== null || event.after !== null) && <details className="mt-3"><summary className="cursor-pointer text-blue-400">View recorded evidence</summary><div className="mt-2 grid gap-3 lg:grid-cols-2">{event.before !== null && <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">{JSON.stringify(event.before, null, 2)}</pre>}{event.after !== null && <pre className="max-h-72 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">{JSON.stringify(event.after, null, 2)}</pre>}</div></details>}
                </td>
              </tr>
            ))}</tbody>
          </table>
          {events.length === 0 && <p className="p-10 text-center text-slate-500">No audit events match these filters.</p>}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">Page {page} of {totalPages}</p>
          <div className="flex gap-3">
            {page > 1 && <Link href={pageHref(page - 1)} className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800">Previous</Link>}
            {page < totalPages && <Link href={pageHref(page + 1)} className="rounded-lg border border-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-800">Next</Link>}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
