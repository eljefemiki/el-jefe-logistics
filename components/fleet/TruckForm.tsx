"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Save,
  Truck,
} from "lucide-react";

import {
  createTruckAction,
  type CreateTruckActionState,
  updateTruckAction,
} from "@/src/server/fleet/actions";
import type { FleetTruckDTO } from "@/src/server/fleet/types";

const initialCreateTruckState: CreateTruckActionState = {
  success: false,
  message: "",
};

function FieldError({
  errors,
}: {
  errors?: string[];
}) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <p className="mt-2 text-sm text-red-400">
      {errors[0]}
    </p>
  );
}

const inputClasses =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-2 block text-sm font-medium text-slate-300";

interface TruckFormProps {
  truck?: FleetTruckDTO;
}

function formatDateInput(value: Date | null | undefined) {
  if (!value) {
    return undefined;
  }

  return value.toISOString().slice(0, 10);
}

export default function TruckForm({
  truck,
}: TruckFormProps) {
  const router = useRouter();
  const isEditing = Boolean(truck);
  const action = truck
    ? updateTruckAction.bind(null, truck.id)
    : createTruckAction;

  const [state, formAction, pending] = useActionState(
    action,
    initialCreateTruckState
  );

  useEffect(() => {
    if (state.success) {
      router.push(
        isEditing && state.truckId
          ? `/dashboard/fleet/${state.truckId}`
          : "/dashboard/fleet",
      );
      router.refresh();
    }
  }, [isEditing, state.success, state.truckId, router]);

  return (
    <form
      action={formAction}
      className="space-y-8"
    >
      {/* Vehicle Information */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <Truck className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Vehicle Information
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Enter the primary identification details for this vehicle.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="fleetNumber"
              className={labelClasses}
            >
              Fleet Number
            </label>

            <input
              id="fleetNumber"
              name="fleetNumber"
              type="text"
              placeholder="EJL-001"
              defaultValue={truck?.fleetNumber}
              required
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.fleetNumber}
            />
          </div>

          <div>
            <label
              htmlFor="registration"
              className={labelClasses}
            >
              Registration
            </label>

            <input
              id="registration"
              name="registration"
              type="text"
              placeholder="YX26 EJL"
              defaultValue={truck?.registration}
              required
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.registration}
            />
          </div>

          <div>
            <label
              htmlFor="manufacturer"
              className={labelClasses}
            >
              Manufacturer
            </label>

            <select
              id="manufacturer"
              name="manufacturer"
              defaultValue={truck?.manufacturer ?? ""}
              required
              className={inputClasses}
            >
              <option value="" disabled>
                Select manufacturer
              </option>

              <option value="VOLVO">
                Volvo
              </option>

              <option value="SCANIA">
                Scania
              </option>

              <option value="DAF">
                DAF
              </option>

              <option value="MAN">
                MAN
              </option>

              <option value="MERCEDES">
                Mercedes-Benz
              </option>

              <option value="RENAULT">
                Renault Trucks
              </option>

              <option value="IVECO">
                Iveco
              </option>
            </select>

            <FieldError
              errors={state.fieldErrors?.manufacturer}
            />
          </div>

          <div>
            <label
              htmlFor="model"
              className={labelClasses}
            >
              Model
            </label>

            <input
              id="model"
              name="model"
              type="text"
              placeholder="FH16 Aero"
              defaultValue={truck?.model}
              required
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.model}
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className={labelClasses}
            >
              Vehicle Type
            </label>

            <select
              id="type"
              name="type"
              defaultValue={truck?.type ?? "TRACTOR"}
              className={inputClasses}
            >
              <option value="TRACTOR">
                Tractor Unit
              </option>

              <option value="RIGID">
                Rigid Truck
              </option>
            </select>

            <FieldError
              errors={state.fieldErrors?.type}
            />
          </div>

          <div>
            <label
              htmlFor="year"
              className={labelClasses}
            >
              Year
            </label>

            <input
              id="year"
              name="year"
              type="number"
              min="1950"
              max={new Date().getFullYear() + 1}
              placeholder="2026"
              defaultValue={truck?.year}
              required
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.year}
            />
          </div>

          <div>
            <label
              htmlFor="colour"
              className={labelClasses}
            >
              Colour
            </label>

            <input
              id="colour"
              name="colour"
              type="text"
              placeholder="El Jefe Blue"
              defaultValue={truck?.colour ?? undefined}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.colour}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className={labelClasses}
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={truck?.status ?? "AVAILABLE"}
              className={inputClasses}
            >
              <option value="AVAILABLE">
                Available
              </option>

              <option value="DELIVERING">
                Delivering
              </option>

              <option value="MAINTENANCE">
                Maintenance
              </option>

              <option value="OUT_OF_SERVICE">
                Out of Service
              </option>
            </select>

            <FieldError
              errors={state.fieldErrors?.status}
            />
          </div>
        </div>
      </section>

      {/* Operating Data */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Operating Data
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Record current mileage and fuel information.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="mileage"
              className={labelClasses}
            >
              Current Mileage
            </label>

            <input
              id="mileage"
              name="mileage"
              type="number"
              min="0"
              defaultValue={truck?.mileage ?? 0}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.mileage}
            />
          </div>

          <div>
            <label
              htmlFor="fuelLevel"
              className={labelClasses}
            >
              Fuel Level %
            </label>

            <input
              id="fuelLevel"
              name="fuelLevel"
              type="number"
              min="0"
              max="100"
              defaultValue={truck?.fuelLevel ?? 100}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.fuelLevel}
            />
          </div>
        </div>
      </section>

      {/* Financial Information */}
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Financial Information
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Optional purchase and valuation information.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3">
          <div>
            <label
              htmlFor="purchaseDate"
              className={labelClasses}
            >
              Purchase Date
            </label>

            <input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              defaultValue={formatDateInput(
                truck?.purchaseDate,
              )}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.purchaseDate}
            />
          </div>

          <div>
            <label
              htmlFor="purchasePrice"
              className={labelClasses}
            >
              Purchase Price (£)
            </label>

            <input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="125000"
              defaultValue={truck?.purchasePrice ?? undefined}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.purchasePrice}
            />
          </div>

          <div>
            <label
              htmlFor="currentValue"
              className={labelClasses}
            >
              Current Value (£)
            </label>

            <input
              id="currentValue"
              name="currentValue"
              type="number"
              min="0"
              step="0.01"
              placeholder="110000"
              defaultValue={truck?.currentValue ?? undefined}
              className={inputClasses}
            />

            <FieldError
              errors={state.fieldErrors?.currentValue}
            />
          </div>
        </div>
      </section>

      {/* Result message */}
      {state.message && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            state.success
              ? "border-green-500/30 bg-green-500/10 text-green-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {!state.success && (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          )}

          <p className="text-sm">
            {state.message}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <Link
          href={
            truck
              ? `/dashboard/fleet/${truck.id}`
              : "/dashboard/fleet"
          }
          className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {isEditing ? "Updating Truck..." : "Saving Truck..."}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEditing ? "Update Truck" : "Save Truck"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
