import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getJobDashboard, getJobs } from "@/src/server/jobs/service";

export const dynamic = "force-dynamic";

const money = (value: number | null, currency = "EUR") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(value ?? 0);
const date = (value: Date | null) => value ? new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(value) : "—";

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ q?: string; driver?: string }> }) {
  const { q, driver } = await searchParams;
  const [jobs, dashboard] = await Promise.all([getJobs(q, driver), getJobDashboard()]);
  return (
    <DashboardLayout title="Trucky Jobs" subtitle="Live and completed delivery records imported from Trucky.">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {[
            ["Active", dashboard.active.toLocaleString()],
            ["Completed", dashboard.completed.toLocaleString()],
            ["Uninvoiced", dashboard.uninvoiced.toLocaleString()],
            ["Distance", `${dashboard.distanceKm.toLocaleString()} km`],
            ["Revenue", money(dashboard.revenue)],
            ["Profit", money(dashboard.profit)],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></div>)}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-sm">
          <span className="text-slate-400">Last successful sync: {date(dashboard.sync?.lastSuccessfulAt ?? null)}</span>
          {dashboard.sync?.lastError && <span className="text-rose-300">{dashboard.sync.lastError}</span>}
          <form action="/dashboard/jobs"><input name="q" defaultValue={q} placeholder="Search jobs" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></form>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900 text-left text-slate-400"><tr>{["Status","Driver","Route","Cargo","Distance","Revenue","Profit","Completed","Finance"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950">
              {jobs.map((job) => <tr key={job.id} className="text-slate-300">
                <td className="px-4 py-3">{job.status}</td>
                <td className="px-4 py-3">{job.driver ? <Link className="text-blue-400 hover:text-blue-300" href={`/dashboard/drivers/${job.driver.id}`}>{job.driver.account.firstName} {job.driver.account.lastName}</Link> : "Unmatched"}</td>
                <td className="px-4 py-3">{job.sourceCity ?? "?"} → {job.destinationCity ?? "?"}</td>
                <td className="px-4 py-3">{job.cargo ?? "—"}</td>
                <td className="px-4 py-3">{(job.drivenDistanceKm ?? job.distanceKm ?? 0).toLocaleString()} km</td>
                <td className="px-4 py-3">{money(job.revenue, job.currency)}</td>
                <td className="px-4 py-3">{money(job.profit, job.currency)}</td>
                <td className="px-4 py-3">{date(job.completedAt)}</td>
                <td className="px-4 py-3">{job.invoice ? <Link className="text-blue-400" href={`/dashboard/finance/${job.invoice.id}`}>{job.invoice.invoiceNumber}</Link> : job.status === "COMPLETED" ? "Ready" : "Pending"}</td>
              </tr>)}
              {!jobs.length && <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-500">No Trucky jobs have been imported yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
