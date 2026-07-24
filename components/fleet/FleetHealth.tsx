"use client";

import type { FleetDashboardDTO } from "@/src/server/fleet/types";

interface FleetHealthProps {
  dashboard: FleetDashboardDTO;
}

export default function FleetHealth({
  dashboard,
}: FleetHealthProps) {
  const serviceDue =
    dashboard.maintenance + dashboard.outOfService;
  const criticalAlerts = dashboard.alerts.filter(
    (alert) => alert.level === "CRITICAL",
  ).length;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-semibold text-white">
        Fleet Health
      </h2>

      <div className="mt-8">

        <div className="flex items-center justify-between">

          <span className="text-slate-400">
            Overall Health
          </span>

          <span className="font-bold text-green-400">
            {dashboard.healthScore}%
          </span>

        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-800">

          <div
            className="h-full rounded-full bg-green-500"
            style={{
              width: `${dashboard.healthScore}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">

        <div>
          <p className="text-3xl font-bold text-white">
            {dashboard.totalFleet}
          </p>

          <p className="text-slate-400">
            Total Trucks
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold text-white">
            {serviceDue}
          </p>

          <p className="text-slate-400">
            Service Due
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold text-white">
            {criticalAlerts}
          </p>

          <p className="text-slate-400">
            Critical
          </p>
        </div>

        <div>
          <p className="text-3xl font-bold text-white">
            {dashboard.averageFuelLevel}%
          </p>

          <p className="text-slate-400">
            Average Fuel
          </p>
        </div>

      </div>

    </div>
  );
}
