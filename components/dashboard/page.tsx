import DashboardLayout from "@/components/layout/DashboardLayout";

import FleetHeader from "@/components/fleet/FleetHeader";
import FleetStats from "@/components/fleet/FleetStats";

export default function FleetPage() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <FleetHeader />

        <FleetStats />

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">

          <h2 className="text-xl font-semibold text-white">
            Fleet Table
          </h2>

          <p className="mt-3 text-slate-400">
            Truck management table coming in Stage 2.
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}