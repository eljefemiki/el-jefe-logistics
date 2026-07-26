import type { FleetAlertDTO } from "@/src/server/fleet/types";

export default function FleetAlerts({ alerts }: { alerts: FleetAlertDTO[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Fleet Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert) => (

          <div
            key={alert.id}
            className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
          >

            <p className="font-semibold text-white">
              {alert.level.charAt(0) + alert.level.slice(1).toLowerCase()} · {alert.title}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {alert.message}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}
