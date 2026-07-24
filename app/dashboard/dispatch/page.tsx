import DashboardLayout from "@/components/layout/DashboardLayout";
import DispatchAlerts from "@/components/dispatch/DispatchAlerts";
import DispatchReadiness from "@/components/dispatch/DispatchReadiness";
import DispatchStats from "@/components/dispatch/DispatchStats";
import DispatchWorkflow from "@/components/dispatch/DispatchWorkflow";

import { getDispatchCentre } from "@/src/server/dispatch/service";

export const dynamic = "force-dynamic";

export default async function DispatchPage() {
  const dispatch = await getDispatchCentre();

  return (
    <DashboardLayout
      title="Dispatch Centre"
      subtitle="Plan assignments from customer request through invoice handoff."
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dispatch Centre
            </h1>

            <p className="mt-2 max-w-3xl text-slate-400">
              Customer, dispatch, driver, truck, journey, fuel,
              maintenance and invoice flow for JefeCore operations.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">
            v0.5.0 operational read model
          </div>
        </div>

        <DispatchStats readiness={dispatch.readiness} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <DispatchWorkflow stages={dispatch.workflow} />
          </div>

          <div className="space-y-6">
            <DispatchReadiness readiness={dispatch.readiness} />
            <DispatchAlerts alerts={dispatch.alerts} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
