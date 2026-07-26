import { AlertTriangle, CalendarClock, CircleDollarSign, PackageOpen, Wrench } from "lucide-react";

export default function WorkshopStats({ stats }: { stats: { active: number; critical: number; waitingParts: number; scheduled: number; estimatedExposure: number; telemetryIssues: number } }) {
  const cards = [
    { label: "Active work orders", value: stats.active, icon: Wrench, colour: "text-blue-400" },
    { label: "Critical", value: stats.critical, icon: AlertTriangle, colour: "text-red-400" },
    { label: "Waiting parts", value: stats.waitingParts, icon: PackageOpen, colour: "text-amber-400" },
    { label: "Scheduled", value: stats.scheduled, icon: CalendarClock, colour: "text-violet-400" },
    { label: "Cost exposure", value: `£${stats.estimatedExposure.toLocaleString("en-GB")}`, icon: CircleDollarSign, colour: "text-emerald-400" },
    { label: "Trucky issues", value: stats.telemetryIssues, icon: AlertTriangle, colour: "text-orange-400" },
  ];
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">{cards.map(({ label, value, icon: Icon, colour }) => (
    <div key={label} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between"><p className="text-sm text-slate-400">{label}</p><Icon className={`h-5 w-5 ${colour}`} /></div>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  ))}</div>;
}
