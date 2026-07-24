"use client";

import {
  Gauge,
  Route,
  Truck,
  Users,
} from "lucide-react";

import StatCard from "@/components/ui/StatCard";
import type { DispatchReadinessDTO } from "@/src/server/dispatch/types";

interface DispatchStatsProps {
  readiness: DispatchReadinessDTO;
}

export default function DispatchStats({
  readiness,
}: DispatchStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Dispatch Capacity"
        value={readiness.dispatchCapacity}
        icon={<Route size={22} />}
        subtitle="Driver and truck pairs"
      />

      <StatCard
        title="Available Drivers"
        value={readiness.availableDrivers}
        icon={<Users size={22} />}
        subtitle="Ready for assignment"
      />

      <StatCard
        title="Available Trucks"
        value={readiness.availableTrucks}
        icon={<Truck size={22} />}
        subtitle="Ready for dispatch"
      />

      <StatCard
        title="Readiness"
        value={`${readiness.readinessScore}%`}
        icon={<Gauge size={22} />}
        subtitle="Current dispatch posture"
      />
    </div>
  );
}
