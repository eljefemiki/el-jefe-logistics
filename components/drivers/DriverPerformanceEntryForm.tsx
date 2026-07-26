"use client";

import { useActionState } from "react";
import { ClipboardPlus, Loader2 } from "lucide-react";

import {
  createDriverPerformanceEntryAction,
  type DriverPerformanceActionState,
} from "@/src/server/driver-performance/actions";

interface DriverPerformanceEntryFormProps {
  driverId: string;
  customers: Array<{ id: string; companyName: string }>;
  contracts: Array<{
    id: string;
    reference: string;
    customerId: string;
    weightKg: number | null;
    budget: number;
  }>;
}

const initialState: DriverPerformanceActionState = {
  success: false,
  message: "",
};
const input =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500";

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      {error?.[0] && <p className="mt-2 text-sm text-red-400">{error[0]}</p>}
    </div>
  );
}

export default function DriverPerformanceEntryForm({
  driverId,
  customers,
  contracts,
}: DriverPerformanceEntryFormProps) {
  const [state, action, pending] = useActionState(
    createDriverPerformanceEntryAction,
    initialState,
  );

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-800 p-6">
        <ClipboardPlus className="h-6 w-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-semibold text-white">
            Record completed delivery
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Adds verified performance and financial data to the driver profile.
          </p>
        </div>
      </div>
      <form action={action} className="grid gap-5 p-6 md:grid-cols-2 xl:grid-cols-4">
        <input type="hidden" name="driverId" value={driverId} />
        <Field label="Company" name="customerId" error={state.fieldErrors?.customerId}>
          <select id="customerId" name="customerId" required className={input} defaultValue="">
            <option value="" disabled>Select company</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>{customer.companyName}</option>
            ))}
          </select>
        </Field>
        <Field label="Marketplace contract (optional)" name="contractListingId" error={state.fieldErrors?.contractListingId}>
          <select id="contractListingId" name="contractListingId" className={input} defaultValue="">
            <option value="">No linked contract</option>
            {contracts.map((contract) => (
              <option key={contract.id} value={contract.id}>{contract.reference}</option>
            ))}
          </select>
        </Field>
        <Field label="Completed date" name="completedAt" error={state.fieldErrors?.completedAt}>
          <input id="completedAt" name="completedAt" type="date" required max={new Date().toISOString().slice(0, 10)} className={input} />
        </Field>
        <Field label="Distance (km)" name="distanceKm" error={state.fieldErrors?.distanceKm}>
          <input id="distanceKm" name="distanceKm" type="number" min="1" required className={input} />
        </Field>
        <Field label="Cargo (tonnes)" name="cargoTonnes" error={state.fieldErrors?.cargoTonnes}>
          <input id="cargoTonnes" name="cargoTonnes" type="number" min="0" max="1000" step="0.001" required className={input} />
        </Field>
        <Field label="Driver income (£)" name="income" error={state.fieldErrors?.income}>
          <input id="income" name="income" type="number" min="0" step="0.01" required className={input} />
        </Field>
        <Field label="Driver expenditure (£)" name="expenditure" error={state.fieldErrors?.expenditure}>
          <input id="expenditure" name="expenditure" type="number" min="0" step="0.01" required className={input} />
        </Field>
        <Field label="Company reputation score" name="reputationScore" error={state.fieldErrors?.reputationScore}>
          <input id="reputationScore" name="reputationScore" type="number" min="0" max="100" step="0.1" required className={input} />
        </Field>
        <div className="md:col-span-2 xl:col-span-4">
          <Field label="Notes (optional)" name="notes" error={state.fieldErrors?.notes}>
            <textarea id="notes" name="notes" rows={3} className={input} />
          </Field>
        </div>
        <div className="flex items-center justify-between gap-4 md:col-span-2 xl:col-span-4">
          <p className={`text-sm ${state.success ? "text-emerald-400" : "text-red-400"}`}>
            {state.message}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-blue-600 px-5 font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Recording…" : "Record delivery"}
          </button>
        </div>
      </form>
    </section>
  );
}
