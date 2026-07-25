import { Banknote, CirclePoundSterling, HandCoins, TriangleAlert } from "lucide-react";
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
export default function FinanceStats({ stats }: { stats: { invoiced: number; collected: number; outstanding: number; overdue: number; overdueCount: number } }) {
  const cards = [
    { label: "Total invoiced", value: money.format(stats.invoiced), icon: CirclePoundSterling, colour: "text-violet-400" },
    { label: "Collected", value: money.format(stats.collected), icon: HandCoins, colour: "text-emerald-400" },
    { label: "Outstanding", value: money.format(stats.outstanding), icon: Banknote, colour: "text-amber-400" },
    { label: `Overdue (${stats.overdueCount})`, value: money.format(stats.overdue), icon: TriangleAlert, colour: "text-red-400" },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, colour }) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className={`h-5 w-5 ${colour}`} /></div><p className="mt-3 text-2xl font-bold text-white">{value}</p></div>)}</div>;
}
