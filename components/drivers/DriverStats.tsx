"use client";

import {
  CheckCircle,
  Route,
  Truck,
  Users,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import type { DriverDashboardDTO } from "@/src/server/drivers/types";

interface DriverStatsProps {
  dashboard: DriverDashboardDTO;
}

export default function DriverStats({
  dashboard,
}: DriverStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Drivers"
        value={dashboard.totalDrivers}
        icon={<Users size={22} />}
        subtitle="Active roster records"
      />

      <StatCard
        title="Available"
        value={dashboard.available}
        icon={<CheckCircle size={22} />}
        subtitle="Ready for dispatch"
      />

      <StatCard
        title="Driving"
        value={dashboard.driving}
        icon={<Truck size={22} />}
        subtitle="Currently on duty"
      />

      <StatCard
        title="Distance"
        value={`${dashboard.totalDistanceKm.toLocaleString()} km`}
        icon={<Route size={22} />}
        subtitle="Roster lifetime total"
      />
    </div>
  );
}
