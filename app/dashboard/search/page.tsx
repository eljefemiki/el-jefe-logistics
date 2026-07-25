import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { globalSearch } from "@/src/server/platform/search";
export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  await requirePermission("dashboard:view"); const q = one((await searchParams).q)?.trim() ?? ""; const groups = await globalSearch(q);
  return <DashboardLayout title="Global Search" subtitle="Find records across every JefeCore centre."><div className="space-y-6">
    <form className="flex gap-3"><label className="sr-only" htmlFor="global-q">Search JefeCore</label><input id="global-q" name="q" defaultValue={q} autoFocus placeholder="Truck, driver, job, customer, invoice…" className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-blue-500" /><button className="rounded-xl bg-blue-600 px-6 font-semibold text-white">Search</button></form>
    {q.length < 2 ? <p className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">Enter at least two characters.</p> : groups.length === 0 ? <p className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">No records match “{q}”.</p> :
      <div className="grid gap-5 lg:grid-cols-2">{groups.map(group => <section key={group.group} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><h2 className="font-semibold text-white">{group.group}</h2><div className="mt-3 divide-y divide-slate-800">{group.items.map(item => <Link key={item.id} href={item.href} className="block py-3 hover:text-blue-300"><span className="block font-medium text-slate-100">{item.title}</span><span className="text-sm text-slate-500">{item.detail}</span></Link>)}</div></section>)}</div>}
  </div></DashboardLayout>;
}
