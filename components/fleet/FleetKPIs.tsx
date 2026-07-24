"use client";

import StatCard from "@/components/ui/StatCard";
import {
  PoundSterling,
  Gauge,
  Calendar,
  Activity,
} from "lucide-react";

export default function FleetKPIs() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Fleet Value"
        value="£18.2M"
        icon={<PoundSterling />}
      />

      <StatCard
        title="Average MPG"
        value="8.4"
        icon={<Gauge />}
      />

      <StatCard
        title="Average Fleet Age"
        value="2.6 yrs"
        icon={<Calendar />}
      />

      <StatCard
        title="Utilisation"
        value="92%"
        icon={<Activity />}
      />

    </div>
  );
}