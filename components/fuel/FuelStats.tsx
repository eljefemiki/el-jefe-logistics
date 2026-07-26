import { Banknote, Fuel, Gauge, ReceiptText } from "lucide-react";

const money = (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 2 });

export default function FuelStats({ stats }: { stats: { monthlySpend: number; monthlyQuantity: number; monthlyEnergyKwh: number; averageUnitPrice: number; transactions: number } }) {
  const cards = [
    { label: "Spend this month", value: money(stats.monthlySpend), icon: Banknote },
    { label: "Litres this month", value: stats.monthlyQuantity.toLocaleString("en-GB", { maximumFractionDigits: 1 }), icon: Fuel },
    { label: "Electricity this month", value: `${stats.monthlyEnergyKwh.toLocaleString("en-GB", { maximumFractionDigits: 1 })} kWh`, icon: Fuel },
    { label: "Average liquid price", value: `${money(stats.averageUnitPrice)}/L`, icon: Gauge },
    { label: "Transactions", value: stats.transactions.toString(), icon: ReceiptText },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5"><div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className="h-5 w-5 text-cyan-400" /></div><p className="mt-3 text-2xl font-bold text-white">{value}</p></div>)}</div>;
}
