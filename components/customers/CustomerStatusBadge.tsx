import { clsx } from "clsx";

const labels = { LEAD: "Lead", ACTIVE: "Active", ON_HOLD: "On hold", INACTIVE: "Inactive" };
const styles = {
  LEAD: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  ACTIVE: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  ON_HOLD: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  INACTIVE: "border-slate-600 bg-slate-800 text-slate-300",
};

export default function CustomerStatusBadge({ status }: { status: keyof typeof labels }) {
  return <span className={clsx("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", styles[status])}>{labels[status]}</span>;
}
