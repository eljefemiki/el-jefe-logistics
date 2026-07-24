import type { DispatchReadinessDTO } from "@/src/server/dispatch/types";

interface DispatchReadinessProps {
  readiness: DispatchReadinessDTO;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 py-4 last:border-0">
      <span className="text-sm text-slate-400">
        {label}
      </span>

      <span className="font-semibold text-white">
        {value}
      </span>
    </div>
  );
}

export default function DispatchReadiness({
  readiness,
}: DispatchReadinessProps) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">
        Live Readiness
      </h2>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">
            Dispatch readiness
          </span>

          <span className="font-bold text-green-400">
            {readiness.readinessScore}%
          </span>
        </div>

        <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-green-500"
            style={{
              width: `${readiness.readinessScore}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-6">
        <Row label="Available drivers" value={readiness.availableDrivers} />
        <Row label="Available trucks" value={readiness.availableTrucks} />
        <Row label="Active trucks" value={readiness.activeTrucks} />
        <Row label="Fleet maintenance" value={readiness.maintenanceTrucks} />
        <Row label="Out of service" value={readiness.outOfServiceTrucks} />
      </div>
    </section>
  );
}
