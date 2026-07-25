import { BadgePoundSterling, Gavel, Radio, Send } from "lucide-react";
type Stats = { open: number; awarded: number; liveValue: number; bids: number };
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
export default function MarketplaceStats({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Open contracts", value: stats.open, icon: Radio, colour: "text-emerald-400" },
    { label: "Awarded", value: stats.awarded, icon: Gavel, colour: "text-violet-400" },
    { label: "Live contract value", value: money.format(stats.liveValue), icon: BadgePoundSterling, colour: "text-amber-400" },
    { label: "Marketplace bids", value: stats.bids, icon: Send, colour: "text-sky-400" },
  ];
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(({ label, value, icon: Icon, colour }) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-start justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></div><Icon className={`h-5 w-5 ${colour}`} /></div></div>)}</div>;
}
