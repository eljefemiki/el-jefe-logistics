import {
  Calendar,
  Fuel,
  Gauge,
  PoundSterling,
} from "lucide-react";
import type { ReactNode } from "react";

import type { FleetTruckDTO } from "@/src/server/fleet/types";

interface TruckStatsProps {
  truck: FleetTruckDTO;
}

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Not set";
  }

  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <div className="rounded-lg bg-slate-800 p-2 text-blue-400">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}

export default function TruckStats({
  truck,
}: TruckStatsProps) {
  const age = Math.max(
    0,
    new Date().getFullYear() - truck.year,
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Mileage"
        value={`${truck.mileage.toLocaleString()} mi`}
        subtitle="Current odometer"
        icon={<Gauge className="h-5 w-5" />}
      />

      <StatCard
        title="Fuel"
        value={`${truck.fuelLevel}%`}
        subtitle="Latest recorded level"
        icon={<Fuel className="h-5 w-5" />}
      />

      <StatCard
        title="Age"
        value={`${age} ${age === 1 ? "year" : "years"}`}
        subtitle={`Model year ${truck.year}`}
        icon={<Calendar className="h-5 w-5" />}
      />

      <StatCard
        title="Value"
        value={formatCurrency(truck.currentValue)}
        subtitle="Current valuation"
        icon={<PoundSterling className="h-5 w-5" />}
      />
    </div>
  );
}
