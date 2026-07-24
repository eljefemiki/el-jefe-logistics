import { Banknote, CirclePause, ContactRound, UserRoundCheck, UsersRound } from "lucide-react";

const money = (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });

export default function CustomerStats({ stats }: { stats: { total: number; active: number; leads: number; onHold: number; totalCredit: number } }) {
  const cards = [
    { label: "Customer accounts", value: stats.total.toString(), icon: ContactRound },
    { label: "Active customers", value: stats.active.toString(), icon: UserRoundCheck },
    { label: "Sales leads", value: stats.leads.toString(), icon: UsersRound },
    { label: "Accounts on hold", value: stats.onHold.toString(), icon: CirclePause },
    { label: "Credit exposure", value: money(stats.totalCredit), icon: Banknote },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className="h-5 w-5 text-violet-400" /></div><p className="mt-3 text-2xl font-bold text-white">{value}</p></div>)}</div>;
}
