import type { FleetTruckStatus } from "@/src/server/fleet/types";

interface TruckStatusBadgeProps {
  status: FleetTruckStatus;
}

const statusStyles: Record<FleetTruckStatus, string> = {
  AVAILABLE:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

  DELIVERING:
    "border-blue-500/20 bg-blue-500/10 text-blue-300",

  MAINTENANCE:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",

  OUT_OF_SERVICE:
    "border-red-500/20 bg-red-500/10 text-red-300",
};

const statusLabels: Record<FleetTruckStatus, string> = {
  AVAILABLE: "Available",
  DELIVERING: "Delivering",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Out of Service",
};

export default function TruckStatusBadge({
  status,
}: TruckStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}