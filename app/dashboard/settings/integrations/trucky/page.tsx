import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { getTruckyIntegrationHealth } from "@/src/server/trucky/health";

export const dynamic = "force-dynamic";
const date = (value: Date | null | undefined) => value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(value) : "Never";
const state = (ok: boolean) => ok ? "text-emerald-300" : "text-rose-300";

export default async function TruckyIntegrationHealthPage() {
  await requirePermission("settings:view");
  const health = await getTruckyIntegrationHealth();
  const cards = [
    ["API", health.api.ok ? `Online · ${health.api.latencyMs} ms` : "Unavailable", health.api.ok],
    ["Webhook", health.webhook.configured ? "Signature verification ready" : "Secret missing", health.webhook.configured],
    ["Last sync", date(health.sync?.lastSuccessfulAt), Boolean(health.sync?.lastSuccessfulAt && !health.sync.lastError)],
    ["Last webhook", date(health.webhook.last?.receivedAt), Boolean(health.webhook.last?.processedAt)],
    ["Members", health.api.ok ? health.api.memberCount.toLocaleString() : "Unavailable", health.api.ok],
    ["Jobs", health.jobs.total.toLocaleString(), health.jobs.unmatched === 0],
    ["Failed events", health.webhook.failed.length.toLocaleString(), health.webhook.failed.length === 0],
    ["Scheduler", health.schedulerConfigured ? "Secret configured" : "Not configured", health.schedulerConfigured],
  ] as const;
  return <DashboardLayout title="Trucky Integration Health" subtitle="Read-only connectivity, webhook, synchronization and mapping status."><div className="mx-auto max-w-7xl space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, ok]) => <section key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">{label}</p><p className={`mt-2 text-lg font-semibold ${state(ok)}`}>{value}</p></section>)}</div>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Configuration</h2><p className="mt-1 text-sm text-slate-400">Only presence is shown. Secret values are never returned to this page.</p><dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(health.configuration).map(([name, configured]) => <div key={name} className="rounded-lg bg-slate-950 p-4"><dt className="text-xs uppercase text-slate-500">{name}</dt><dd className={`mt-2 font-medium ${state(configured)}`}>{configured ? "Configured" : "Missing"}</dd></div>)}</dl></section>
    <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"><div className="border-b border-slate-800 p-6"><h2 className="text-lg font-semibold text-white">Driver mapping</h2><p className="mt-1 text-sm text-slate-400">{health.mappings.mappedDrivers} of {health.mappings.driverTotal} active drivers mapped. Steam ID or stable Trucky user ID is sufficient.</p></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-950 text-slate-400"><tr>{["Driver","Employee","Trucky user","Steam ID","Jobs","Last sync","Status"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-800">{health.mappings.drivers.map((driver) => { const mapped = Boolean(driver.truckyUserId || driver.steamId); return <tr key={driver.id} className="text-slate-300"><td className="px-4 py-3"><Link className="text-cyan-400 hover:text-cyan-300" href={`/dashboard/drivers/${driver.id}/edit`}>{driver.account.firstName} {driver.account.lastName}</Link></td><td className="px-4 py-3">{driver.employeeNumber}</td><td className="px-4 py-3">{driver.truckyUsername ?? (driver.truckyUserId ? "Configured" : "—")}</td><td className="px-4 py-3">{driver.steamId ? `••••${driver.steamId.slice(-4)}` : "—"}</td><td className="px-4 py-3">{driver._count.transportJobs}</td><td className="px-4 py-3">{date(driver.lastTruckySyncAt)}</td><td className={`px-4 py-3 ${state(mapped)}`}>{mapped ? "Mapped" : "Needs mapping"}</td></tr>; })}</tbody></table></div></section>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Failures and retry status</h2><p className="mt-1 text-sm text-slate-400">Failed webhook records are retained. An automatic retry worker is not configured.</p>{health.webhook.failed.length ? <ul className="mt-4 space-y-2">{health.webhook.failed.map((event) => <li key={event.id} className="rounded-lg bg-slate-950 p-4 text-sm text-slate-300"><span className="font-medium">{event.eventType || "Unknown event"}</span> · {date(event.receivedAt)} · {event.error}</li>)}</ul> : <p className="mt-4 text-sm text-emerald-300">No failed webhook events are waiting for attention.</p>}</section>
  </div></DashboardLayout>;
}
