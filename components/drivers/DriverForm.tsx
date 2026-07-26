"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  Save,
  User,
} from "lucide-react";

import {
  updateDriverAction,
  type UpdateDriverActionState,
} from "@/src/server/drivers/actions";
import type { DriverDTO } from "@/src/server/drivers/types";
import { ets2TrailerTypes, trailerLabels } from "@/src/lib/ets2-trailers";

interface DriverFormProps {
  driver: DriverDTO;
}

const initialState: UpdateDriverActionState = {
  success: false,
  message: "",
};

const inputClasses =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const labelClasses =
  "mb-2 block text-sm font-medium text-slate-300";

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

function formatDateInput(value: Date | null) {
  if (!value) {
    return undefined;
  }

  return value.toISOString().slice(0, 10);
}

export default function DriverForm({
  driver,
}: DriverFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    updateDriverAction.bind(null, driver.id),
    initialState,
  );

  useEffect(() => {
    if (state.success && state.driverId) {
      router.push(`/dashboard/drivers/${state.driverId}`);
      router.refresh();
    }
  }, [state.success, state.driverId, router]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
              <User className="h-5 w-5" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">
                Account Details
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Update the core identity and account status for this driver.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className={labelClasses}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              defaultValue={driver.account.firstName}
              required
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.firstName} />
          </div>

          <div>
            <label htmlFor="lastName" className={labelClasses}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              defaultValue={driver.account.lastName}
              required
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.lastName} />
          </div>

          <div>
            <label htmlFor="email" className={labelClasses}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={driver.account.email}
              required
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-300">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={driver.account.isActive}
              className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-blue-600"
            />
            Account active
          </label>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">
            Driver Record
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Manage roster, rank and operational totals.
          </p>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div>
            <label htmlFor="employeeNumber" className={labelClasses}>
              Employee Number
            </label>
            <input
              id="employeeNumber"
              name="employeeNumber"
              defaultValue={driver.employeeNumber}
              required
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.employeeNumber} />
          </div>

          <div>
            <label htmlFor="callsign" className={labelClasses}>
              Callsign
            </label>
            <input
              id="callsign"
              name="callsign"
              defaultValue={driver.callsign ?? undefined}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.callsign} />
          </div>

          <div>
            <label htmlFor="rank" className={labelClasses}>
              Rank
            </label>
            <select
              id="rank"
              name="rank"
              defaultValue={driver.rank}
              className={inputClasses}
            >
              <option value="TRAINEE">Trainee</option>
              <option value="JUNIOR">Junior</option>
              <option value="SENIOR">Senior</option>
              <option value="ELITE">Elite</option>
            </select>
            <FieldError errors={state.fieldErrors?.rank} />
          </div>

          <div>
            <label htmlFor="status" className={labelClasses}>
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={driver.status}
              className={inputClasses}
            >
              <option value="AVAILABLE">Available</option>
              <option value="DRIVING">Driving</option>
              <option value="OFF_DUTY">Off Duty</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
            <FieldError errors={state.fieldErrors?.status} />
          </div>

          <div>
            <label htmlFor="reputation" className={labelClasses}>
              Reputation %
            </label>
            <input
              id="reputation"
              name="reputation"
              type="number"
              min="0"
              max="100"
              defaultValue={driver.reputation}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.reputation} />
          </div>

          <div>
            <label htmlFor="joinedAt" className={labelClasses}>
              Joined
            </label>
            <input
              id="joinedAt"
              name="joinedAt"
              type="date"
              defaultValue={formatDateInput(driver.joinedAt)}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.joinedAt} />
          </div>

          <div>
            <label htmlFor="totalDistanceKm" className={labelClasses}>
              Total Distance km
            </label>
            <input
              id="totalDistanceKm"
              name="totalDistanceKm"
              type="number"
              min="0"
              defaultValue={driver.totalDistanceKm}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.totalDistanceKm} />
          </div>

          <div>
            <label htmlFor="totalDeliveries" className={labelClasses}>
              Total Deliveries
            </label>
            <input
              id="totalDeliveries"
              name="totalDeliveries"
              type="number"
              min="0"
              defaultValue={driver.totalDeliveries}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.totalDeliveries} />
          </div>

          <div>
            <label htmlFor="totalConvoys" className={labelClasses}>
              Total Convoys
            </label>
            <input
              id="totalConvoys"
              name="totalConvoys"
              type="number"
              min="0"
              defaultValue={driver.totalConvoys}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.totalConvoys} />
          </div>

          <div>
            <label htmlFor="favouriteTruck" className={labelClasses}>
              Favourite Truck
            </label>
            <input
              id="favouriteTruck"
              name="favouriteTruck"
              defaultValue={driver.favouriteTruck ?? undefined}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.favouriteTruck} />
          </div>

          <div>
            <label htmlFor="assignedTrailer" className={labelClasses}>
              Assigned ETS2 Trailer
            </label>
            <select
              id="assignedTrailer"
              name="assignedTrailer"
              defaultValue={driver.assignedTrailer ?? ""}
              className={inputClasses}
            >
              <option value="">No trailer assigned</option>
              {ets2TrailerTypes.map((type) => (
                <option key={type} value={type}>{trailerLabels[type]}</option>
              ))}
            </select>
            <FieldError errors={state.fieldErrors?.assignedTrailer} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="notes" className={labelClasses}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              defaultValue={driver.notes ?? undefined}
              className={inputClasses}
            />
            <FieldError errors={state.fieldErrors?.notes} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
        <div className="border-b border-slate-800 px-6 py-5">
          <h2 className="text-lg font-semibold text-white">Trucky mapping</h2>
          <p className="mt-1 text-sm text-slate-400">Use the stable Trucky user ID and/or the driver&apos;s 17-digit Steam ID. Discord ID is not required.</p>
        </div>
        <div className="grid gap-6 p-6 md:grid-cols-2">
          <div><label htmlFor="truckyUserId" className={labelClasses}>Trucky user ID</label><input id="truckyUserId" name="truckyUserId" defaultValue={driver.truckyUserId ?? undefined} className={inputClasses} /><FieldError errors={state.fieldErrors?.truckyUserId} /></div>
          <div><label htmlFor="steamId" className={labelClasses}>Steam ID</label><input id="steamId" name="steamId" inputMode="numeric" pattern="[0-9]{17}" defaultValue={driver.steamId ?? undefined} className={inputClasses} /><FieldError errors={state.fieldErrors?.steamId} /></div>
          <div className="md:col-span-2"><label htmlFor="truckyUsername" className={labelClasses}>Trucky username</label><input id="truckyUsername" name="truckyUsername" defaultValue={driver.truckyUsername ?? undefined} className={inputClasses} /><FieldError errors={state.fieldErrors?.truckyUsername} /></div>
        </div>
      </section>

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

      <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">
        <Link
          href={`/dashboard/drivers/${driver.id}`}
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
              Updating Driver...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Update Driver
            </>
          )}
        </button>
      </div>
    </form>
  );
}
