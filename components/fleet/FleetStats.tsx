"use client";

import StatCard from "@/components/ui/StatCard";
import {
  Truck,
  CheckCircle,
  Wrench,
  Package,
} from "lucide-react";
import type { FleetDashboardDTO } from "@/src/server/fleet/types";

interface FleetStatsProps {
  dashboard?: FleetDashboardDTO;
}

export default function FleetStats({
  dashboard,
}: FleetStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Trucks"
        value={`${dashboard?.totalFleet ?? 0}`}
        icon={<Truck size={22} />}
        subtitle="Fleet vehicles"
      />

      <StatCard
        title="Available"
        value={`${dashboard?.available ?? 0}`}
        icon={<CheckCircle size={22} />}
        subtitle="Ready for dispatch"
      />

      <StatCard
        title="Delivering"
        value={`${dashboard?.delivering ?? 0}`}
        icon={<Package size={22} />}
        subtitle="Currently active"
      />

      <StatCard
        title="Maintenance"
        value={`${dashboard?.maintenance ?? 0}`}
        icon={<Wrench size={22} />}
        subtitle="Service required"
      />

    </div>
  );
}
