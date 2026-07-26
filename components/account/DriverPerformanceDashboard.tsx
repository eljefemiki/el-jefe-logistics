import {
  Banknote,
  ChartNoAxesCombined,
  Package,
  Route,
  Scale,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

import type { getDriverPerformance } from "@/src/server/driver-performance/queries";

type Performance = Awaited<ReturnType<typeof getDriverPerformance>>;

function money(value: number) {
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

function number(value: number, maximumFractionDigits = 0) {
  return value.toLocaleString("en-GB", { maximumFractionDigits });
}

function Metric({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between text-slate-400">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-blue-400">{icon}</span>
      </div>
      <p className="mt-4 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{detail}</p>
    </div>
  );
}

export default function DriverPerformanceDashboard({
  performance,
  fallbackReputation,
  fallbackDistanceKm,
}: {
  performance: Performance;
  fallbackReputation: number;
  fallbackDistanceKm: number;
}) {
  const overallReputation =
    performance.allTime.reputation ?? fallbackReputation;
  const allTimeDistance = Math.max(
    fallbackDistanceKm,
    performance.allTime.distanceKm,
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="font-semibold uppercase tracking-[0.2em] text-blue-400">
          Driver performance
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">
          Your driving record
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric
          label="Distance · last 30 days"
          value={`${number(performance.lastThirtyDays.distanceKm)} km`}
          detail={`${performance.lastThirtyDays.deliveries} completed deliveries`}
          icon={<Route className="h-5 w-5" />}
        />
        <Metric
          label="Distance · all time"
          value={`${number(allTimeDistance)} km`}
          detail="Lifetime recorded distance"
          icon={<ChartNoAxesCombined className="h-5 w-5" />}
        />
        <Metric
          label="Cargo transported"
          value={`${number(performance.allTime.cargoTonnes, 2)} t`}
          detail={`${number(performance.lastThirtyDays.cargoTonnes, 2)} t in the last 30 days`}
          icon={<Scale className="h-5 w-5" />}
        />
        <Metric
          label="Overall reputation"
          value={`${number(overallReputation, 1)}%`}
          detail="Average completed-delivery score"
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <Metric
          label="Total earnings"
          value={money(performance.allTime.income)}
          detail={`${money(performance.lastThirtyDays.income)} in the last 30 days`}
          icon={<Banknote className="h-5 w-5" />}
        />
        <Metric
          label="Overall profit / loss"
          value={money(performance.allTime.profit)}
          detail={`${money(performance.allTime.expenditure)} total expenditure`}
          icon={<Package className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">
            Reputation by company
          </h3>
          {performance.companyReputation.length ? (
            <div className="mt-4 space-y-3">
              {performance.companyReputation.map((company) => (
                <div
                  key={company.customerId}
                  className="flex items-center justify-between rounded-xl bg-slate-950 p-4"
                >
                  <div>
                    <p className="font-medium text-white">{company.companyName}</p>
                    <p className="text-sm text-slate-500">
                      {company.deliveries} deliveries
                    </p>
                  </div>
                  <span className="font-bold text-emerald-400">
                    {number(company.reputation, 1)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              Company ratings will appear after completed deliveries are recorded.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-xl font-semibold text-white">
            Income and expenditure
          </h3>
          <dl className="mt-4 space-y-3">
            {[
              ["Income", performance.allTime.income],
              ["Expenditure", performance.allTime.expenditure],
              ["Net profit / loss", performance.allTime.profit],
            ].map(([label, value]) => (
              <div
                key={String(label)}
                className="flex justify-between border-b border-slate-800 pb-3 text-sm last:border-0"
              >
                <dt className="text-slate-400">{label}</dt>
                <dd className="font-semibold text-white">{money(Number(value))}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
