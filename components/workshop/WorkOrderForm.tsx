"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { createMaintenanceJobAction, type MaintenanceActionState, updateMaintenanceJobAction } from "@/src/server/workshop/actions";

type Job = NonNullable<Awaited<ReturnType<typeof import("@/src/server/workshop/service").getMaintenanceJob>>>;
type Truck = Awaited<ReturnType<typeof import("@/src/server/workshop/service").getWorkshopTrucks>>[number];
const initial: MaintenanceActionState = { success: false, message: "" };
const input = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";
const label = "mb-2 block text-sm font-medium text-slate-300";

function Field({ name, title, error, children }: { name: string; title: string; error?: string[]; children: React.ReactNode }) {
  return <div><label htmlFor={name} className={label}>{title}</label>{children}{error?.[0] && <p className="mt-2 text-sm text-red-400">{error[0]}</p>}</div>;
}

export default function WorkOrderForm({ trucks, job }: { trucks: Truck[]; job?: Job }) {
  const router = useRouter();
  const action = job ? updateMaintenanceJobAction.bind(null, job.id) : createMaintenanceJobAction;
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => {
    if (state.success && state.jobId) { router.push(`/dashboard/maintenance/${state.jobId}`); router.refresh(); }
  }, [state, router]);
  const date = job?.scheduledFor?.toISOString().slice(0, 10);
  return <form action={formAction} className="space-y-6">
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-lg font-semibold text-white">Work order</h2>
      <p className="mt-1 text-sm text-slate-400">Record the vehicle, scope, urgency and workshop ownership.</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Field name="truckId" title="Vehicle" error={state.fieldErrors?.truckId}><select id="truckId" name="truckId" defaultValue={job?.truckId ?? ""} required className={input}><option value="" disabled>Select truck</option>{trucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.fleetNumber} · {truck.registration} · {truck.manufacturer} {truck.model}</option>)}</select></Field>
        <Field name="title" title="Job title" error={state.fieldErrors?.title}><input id="title" name="title" defaultValue={job?.title} placeholder="Investigate brake pressure warning" required className={input} /></Field>
        <Field name="type" title="Work type" error={state.fieldErrors?.type}><select id="type" name="type" defaultValue={job?.type ?? "REPAIR"} className={input}><option value="INSPECTION">Inspection</option><option value="PREVENTIVE_SERVICE">Preventive service</option><option value="REPAIR">Repair</option><option value="TYRES">Tyres</option><option value="MOT">MOT</option><option value="BREAKDOWN">Breakdown</option><option value="OTHER">Other</option></select></Field>
        <Field name="priority" title="Priority" error={state.fieldErrors?.priority}><select id="priority" name="priority" defaultValue={job?.priority ?? "ROUTINE"} className={input}><option value="LOW">Low</option><option value="ROUTINE">Routine</option><option value="HIGH">High</option><option value="CRITICAL">Critical</option></select></Field>
        <Field name="status" title="Status" error={state.fieldErrors?.status}><select id="status" name="status" defaultValue={job?.status ?? "REPORTED"} className={input}><option value="REPORTED">Reported</option><option value="SCHEDULED">Scheduled</option><option value="IN_PROGRESS">In progress</option><option value="WAITING_PARTS">Waiting parts</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option></select></Field>
        <Field name="scheduledFor" title="Scheduled date" error={state.fieldErrors?.scheduledFor}><input id="scheduledFor" name="scheduledFor" type="date" defaultValue={date} className={input} /></Field>
        <Field name="technician" title="Technician" error={state.fieldErrors?.technician}><input id="technician" name="technician" defaultValue={job?.technician ?? ""} placeholder="Workshop owner" className={input} /></Field>
        <Field name="vendor" title="External vendor" error={state.fieldErrors?.vendor}><input id="vendor" name="vendor" defaultValue={job?.vendor ?? ""} placeholder="Optional supplier" className={input} /></Field>
        <Field name="odometerKm" title="Odometer (km)" error={state.fieldErrors?.odometerKm}><input id="odometerKm" name="odometerKm" type="number" min="0" defaultValue={job?.odometerKm ?? undefined} className={input} /></Field>
        <Field name="estimatedCost" title="Estimated cost (£)" error={state.fieldErrors?.estimatedCost}><input id="estimatedCost" name="estimatedCost" type="number" min="0" step="0.01" defaultValue={job?.estimatedCost ?? undefined} className={input} /></Field>
        <Field name="actualCost" title="Actual cost (£)" error={state.fieldErrors?.actualCost}><input id="actualCost" name="actualCost" type="number" min="0" step="0.01" defaultValue={job?.actualCost ?? undefined} className={input} /></Field>
      </div>
      <div className="mt-6 space-y-6">
        <Field name="description" title="Description" error={state.fieldErrors?.description}><textarea id="description" name="description" rows={4} defaultValue={job?.description ?? ""} className={input} /></Field>
        <Field name="notes" title="Workshop notes" error={state.fieldErrors?.notes}><textarea id="notes" name="notes" rows={4} defaultValue={job?.notes ?? ""} className={input} /></Field>
      </div>
    </section>
    {state.message && !state.success && <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"><AlertCircle className="h-5 w-5" /><p className="text-sm">{state.message}</p></div>}
    <div className="flex justify-end gap-3"><Link href={job ? `/dashboard/maintenance/${job.id}` : "/dashboard/maintenance"} className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800">Cancel</Link><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{job ? "Update work order" : "Create work order"}</button></div>
  </form>;
}
