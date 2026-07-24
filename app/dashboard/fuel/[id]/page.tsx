import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getFuelEntry } from "@/src/server/fuel/service";

export const dynamic = "force-dynamic";
const money = (value: number) => value.toLocaleString("en-GB", { style: "currency", currency: "GBP" });
const date = (value: Date) => new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short" }).format(value);

export default async function FuelEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = await getFuelEntry(id);
  if (!entry) notFound();
  const rows = [
    ["Vehicle", `${entry.truck.fleetNumber} · ${entry.truck.registration}`],
    ["Fuel / energy", entry.fuelType],
    ["Quantity", `${entry.quantity.toLocaleString("en-GB")} ${entry.fuelType === "ELECTRIC" ? "kWh" : "litres"}`],
    ["Unit price", money(entry.unitPrice)],
    ["Total cost", money(entry.totalCost)],
    ["Odometer", `${entry.odometerKm.toLocaleString("en-GB")} km`],
    ["Fuel level after", entry.fuelLevelAfter === null ? "Not recorded" : `${entry.fuelLevelAfter}%`],
    ["Station", entry.station],
    ["Location", entry.location ?? "Not recorded"],
    ["Receipt reference", entry.receiptNumber ?? "Not recorded"],
    ["Purchased", date(entry.purchasedAt)],
  ];
  return <DashboardLayout title={entry.reference} subtitle="Fuel transaction record."><div className="mx-auto max-w-5xl space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><Link href="/dashboard/fuel" className="text-sm text-cyan-400 hover:text-cyan-300">← Fuel Centre</Link><h1 className="mt-2 text-3xl font-bold text-white">{entry.reference}</h1><p className="mt-2 text-slate-400">{entry.truck.manufacturer} {entry.truck.model}</p></div><Link href={`/dashboard/fuel/${entry.id}/edit`} className="rounded-lg bg-cyan-600 px-4 py-2 text-center font-medium text-white hover:bg-cyan-500">Edit entry</Link></div>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Transaction</h2><dl className="mt-4 grid gap-x-8 md:grid-cols-2">{rows.map(([label, value]) => <div key={label} className="border-b border-slate-800 py-4"><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-1 font-medium text-slate-200">{value}</dd></div>)}</dl>{entry.notes && <div className="mt-6 rounded-lg bg-slate-950 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Notes</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{entry.notes}</p></div>}</section>
  </div></DashboardLayout>;
}
