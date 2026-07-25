import { clsx } from "clsx";
const labels = { DRAFT: "Draft", SENT: "Sent", PART_PAID: "Part paid", PAID: "Paid", OVERDUE: "Overdue", VOID: "Void" };
const colours = { DRAFT: "bg-slate-700 text-slate-200", SENT: "bg-blue-500/15 text-blue-300", PART_PAID: "bg-amber-500/15 text-amber-300", PAID: "bg-emerald-500/15 text-emerald-300", OVERDUE: "bg-red-500/15 text-red-300", VOID: "bg-slate-800 text-slate-400" };
export default function InvoiceStatusBadge({ status, overdue = false }: { status: keyof typeof labels; overdue?: boolean }) {
  const display = overdue && !["PAID", "VOID"].includes(status) ? "OVERDUE" : status;
  return <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", colours[display])}>{labels[display]}</span>;
}
