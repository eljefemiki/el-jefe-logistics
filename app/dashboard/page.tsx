import DashboardLayout from "@/components/layout/DashboardLayout";
import { requirePermission } from "@/src/lib/auth";
import { getExecutiveDashboard } from "@/src/server/platform/dashboard";
export const dynamic = "force-dynamic";
const money = (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
export default async function DashboardPage() {
  await requirePermission("dashboard:view"); const kpi = await getExecutiveDashboard();
  const cards = [["Revenue", money(kpi.revenue)],["Operating profit*", money(kpi.profit)],["Fleet availability", `${kpi.fleetAvailability}%`],["Active dispatch jobs†", String(kpi.activeJobs)],["Drivers working", String(kpi.driversWorking)],["Fuel spend", money(kpi.fuelSpend)],["Workshop queue", String(kpi.workshopQueue)],["Delayed jobs†", String(kpi.delayedJobs)],["Overdue invoices", String(kpi.overdueInvoices)]];
  return <DashboardLayout title="Executive Dashboard" subtitle="Live JefeCore enterprise performance."><div className="space-y-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value]) => <section key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-6"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-white">{value}</p></section>)}</div><div className="rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-400"><p>* Operating profit currently uses collected revenue less recorded fuel spend; broader cost-of-service data is not yet present.</p><p className="mt-2">† Dispatch remains a readiness read model in v1.0, so persisted job/delay counts remain zero until a DispatchJob ledger is introduced.</p></div></div></DashboardLayout>;
}
