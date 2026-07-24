import {
  AlertTriangle,
  Info,
  Siren,
} from "lucide-react";

import type { DispatchAlertDTO } from "@/src/server/dispatch/types";

interface DispatchAlertsProps {
  alerts: DispatchAlertDTO[];
}

const alertStyles = {
  INFO: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  WARNING:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
  CRITICAL:
    "border-red-500/20 bg-red-500/10 text-red-300",
} as const;

const icons = {
  INFO: Info,
  WARNING: AlertTriangle,
  CRITICAL: Siren,
} as const;

export default function DispatchAlerts({
  alerts,
}: DispatchAlertsProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">
        Dispatch Alerts
      </h2>

      <div className="mt-5 space-y-3">
        {alerts.map((alert) => {
          const Icon = icons[alert.level];

          return (
            <div
              key={alert.id}
              className={`rounded-lg border p-4 ${alertStyles[alert.level]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <h3 className="font-semibold">
                    {alert.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 opacity-90">
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
