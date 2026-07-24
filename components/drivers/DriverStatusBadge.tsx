import type { DriverStatus } from "@/src/server/drivers/types";

interface DriverStatusBadgeProps {
  status: DriverStatus;
}

const statusStyles: Record<DriverStatus, string> = {
  AVAILABLE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  DRIVING:
    "border-blue-500/20 bg-blue-500/10 text-blue-300",
  OFF_DUTY:
    "border-slate-500/20 bg-slate-500/10 text-slate-300",
  ON_LEAVE:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
  SUSPENDED:
    "border-red-500/20 bg-red-500/10 text-red-300",
};

const statusLabels: Record<DriverStatus, string> = {
  AVAILABLE: "Available",
  DRIVING: "Driving",
  OFF_DUTY: "Off Duty",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
};

export default function DriverStatusBadge({
  status,
}: DriverStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
