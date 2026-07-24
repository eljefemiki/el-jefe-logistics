import {
  ArrowDown,
  BadgePoundSterling,
  ClipboardList,
  Fuel,
  PackageCheck,
  Route,
  Truck,
  User,
  Users,
  Wrench,
} from "lucide-react";

import type {
  DispatchStageStatus,
  DispatchWorkflowStageDTO,
} from "@/src/server/dispatch/types";

interface DispatchWorkflowProps {
  stages: DispatchWorkflowStageDTO[];
}

const icons: Record<string, React.ElementType> = {
  customer: Users,
  dispatch: ClipboardList,
  driver: User,
  truck: Truck,
  journey: Route,
  fuel: Fuel,
  maintenance: Wrench,
  invoice: BadgePoundSterling,
};

const statusStyles: Record<DispatchStageStatus, string> = {
  LIVE: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  READY: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  PENDING_SCHEMA:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

const statusLabels: Record<DispatchStageStatus, string> = {
  LIVE: "Live",
  READY: "Ready",
  PENDING_SCHEMA: "Pending Schema",
};

export default function DispatchWorkflow({
  stages,
}: DispatchWorkflowProps) {
  const customer = stages.find((stage) => stage.id === "customer");
  const dispatch = stages.find((stage) => stage.id === "dispatch");
  const driver = stages.find((stage) => stage.id === "driver");
  const truck = stages.find((stage) => stage.id === "truck");
  const rest = stages.filter((stage) =>
    ["journey", "fuel", "maintenance", "invoice"].includes(stage.id),
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Dispatch Workflow
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Customer to invoice operational chain for v0.5.0.
          </p>
        </div>

        <PackageCheck className="h-6 w-6 text-blue-400" />
      </div>

      <div className="mt-6 space-y-4">
        {customer && <StageCard stage={customer} />}
        <Connector />
        {dispatch && <StageCard stage={dispatch} />}

        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Connector className="md:hidden" />
          {driver && <StageCard stage={driver} />}
          <div className="hidden text-slate-600 md:block">
            <ArrowDown className="mx-auto h-5 w-5 rotate-[-90deg]" />
          </div>
          {truck && <StageCard stage={truck} />}
        </div>

        {rest.map((stage) => (
          <div key={stage.id}>
            <Connector />
            <StageCard stage={stage} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Connector({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <ArrowDown className="mx-auto h-5 w-5 text-slate-600" />
    </div>
  );
}

function StageCard({
  stage,
}: {
  stage: DispatchWorkflowStageDTO;
}) {
  const Icon = icons[stage.id] ?? ClipboardList;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {stage.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              {stage.description}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[stage.status]}`}
        >
          {statusLabels[stage.status]}
        </span>
      </div>
    </div>
  );
}
