"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { createFuelEntryAction, type FuelActionState, updateFuelEntryAction } from "@/src/server/fuel/actions";

type Entry = NonNullable<Awaited<ReturnType<typeof import("@/src/server/fuel/service").getFuelEntry>>>;
type Truck = Awaited<ReturnType<typeof import("@/src/server/fuel/service").getFuelTrucks>>[number];
const initial: FuelActionState = { success: false, message: "" };
const input = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";
const label = "mb-2 block text-sm font-medium text-slate-300";

function Field({ name, title, error, children }: { name: string; title: string; error?: string[]; children: React.ReactNode }) {
  return <div><label htmlFor={name} className={label}>{title}</label>{children}{error?.[0] && <p className="mt-2 text-sm text-red-400">{error[0]}</p>}</div>;
}

export default function FuelEntryForm({ trucks, entry, selectedTruckId }: { trucks: Truck[]; entry?: Entry; selectedTruckId?: string }) {
  const router = useRouter();
  const action = entry ? updateFuelEntryAction.bind(null, entry.id) : createFuelEntryAction;
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => { if (state.success && state.entryId) { router.push(`/dashboard/fuel/${state.entryId}`); router.refresh(); } }, [state, router]);
  const purchasedAt = entry ? entry.purchasedAt.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
  return <form action={formAction} className="space-y-6"><section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Transaction details</h2><p className="mt-1 text-sm text-slate-400">Capture the vehicle, quantity, price and proof of purchase.</p><div className="mt-6 grid gap-6 md:grid-cols-2">
    <Field name="truckId" title="Vehicle" error={state.fieldErrors?.truckId}><select id="truckId" name="truckId" defaultValue={entry?.truckId ?? selectedTruckId ?? ""} required className={input}><option value="" disabled>Select truck</option>{trucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.fleetNumber} · {truck.registration} · {truck.manufacturer} {truck.model}</option>)}</select></Field>
    <Field name="fuelType" title="Fuel / energy type" error={state.fieldErrors?.fuelType}><select id="fuelType" name="fuelType" defaultValue={entry?.fuelType ?? "DIESEL"} className={input}><option value="DIESEL">Diesel</option><option value="HVO">HVO</option><option value="ADBLUE">AdBlue</option><option value="ELECTRIC">Electric</option><option value="OTHER">Other</option></select></Field>
    <Field name="quantity" title="Quantity (litres or kWh)" error={state.fieldErrors?.quantity}><input id="quantity" name="quantity" type="number" min="0.01" step="0.01" defaultValue={entry?.quantity} required className={input} /></Field>
    <Field name="unitPrice" title="Unit price (£)" error={state.fieldErrors?.unitPrice}><input id="unitPrice" name="unitPrice" type="number" min="0.001" step="0.001" defaultValue={entry?.unitPrice} required className={input} /></Field>
    <Field name="odometerKm" title="Odometer (km)" error={state.fieldErrors?.odometerKm}><input id="odometerKm" name="odometerKm" type="number" min="0" defaultValue={entry?.odometerKm} required className={input} /></Field>
    <Field name="fuelLevelAfter" title="Fuel level after (%)" error={state.fieldErrors?.fuelLevelAfter}><input id="fuelLevelAfter" name="fuelLevelAfter" type="number" min="0" max="100" defaultValue={entry?.fuelLevelAfter ?? undefined} className={input} /></Field>
    <Field name="station" title="Station / supplier" error={state.fieldErrors?.station}><input id="station" name="station" defaultValue={entry?.station} required className={input} /></Field>
    <Field name="location" title="Location" error={state.fieldErrors?.location}><input id="location" name="location" defaultValue={entry?.location ?? ""} className={input} /></Field>
    <Field name="purchasedAt" title="Purchased at" error={state.fieldErrors?.purchasedAt}><input id="purchasedAt" name="purchasedAt" type="datetime-local" defaultValue={purchasedAt} required className={input} /></Field>
    <Field name="receiptNumber" title="Receipt / card reference" error={state.fieldErrors?.receiptNumber}><input id="receiptNumber" name="receiptNumber" defaultValue={entry?.receiptNumber ?? ""} className={input} /></Field>
  </div><div className="mt-6"><Field name="notes" title="Notes" error={state.fieldErrors?.notes}><textarea id="notes" name="notes" rows={4} defaultValue={entry?.notes ?? ""} className={input} /></Field></div></section>
  {state.message && !state.success && <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"><AlertCircle className="h-5 w-5" /><p className="text-sm">{state.message}</p></div>}
  <div className="flex justify-end gap-3"><Link href={entry ? `/dashboard/fuel/${entry.id}` : "/dashboard/fuel"} className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800">Cancel</Link><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{entry ? "Update entry" : "Record fuel"}</button></div></form>;
}
