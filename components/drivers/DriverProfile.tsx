import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  Mail,
  Pencil,
  Route,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";

import type { DriverDTO } from "@/src/server/drivers/types";

import DriverArchiveButton from "./DriverArchiveButton";
import DriverRankBadge from "./DriverRank";
import DriverStatusBadge from "./DriverStatusBadge";

interface DriverProfileProps {
  driver: DriverDTO;
}

function fullName(driver: DriverDTO) {
  return `${driver.account.firstName} ${driver.account.lastName}`.trim();
}

function formatDate(value: Date | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-b border-slate-800 py-4 last:border-0">
      <dt className="text-sm text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 font-medium text-slate-200">
        {value}
      </dd>
    </div>
  );
}

function Metric({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-slate-400">
          {title}
        </p>

        <div className="rounded-lg bg-slate-800 p-2 text-blue-400">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-2xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

export default function DriverProfile({
  driver,
}: DriverProfileProps) {
  const name = fullName(driver);

  return (
    <div className="space-y-8">
      <div className="space-y-6 border-b border-slate-800 pb-8">
        <Link
          href="/dashboard/drivers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Driver Centre
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <User className="h-7 w-7" />
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <DriverStatusBadge status={driver.status} />
                <DriverRankBadge rank={driver.rank} />

                {driver.archivedAt && (
                  <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                    Archived
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                {name}
              </h1>

              <p className="mt-3 text-slate-400">
                {driver.employeeNumber}
                {driver.callsign ? ` · ${driver.callsign}` : ""} ·{" "}
                {driver.account.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/dashboard/drivers/${driver.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Pencil className="h-4 w-4" />
              Edit Driver
            </Link>

            <DriverArchiveButton
              id={driver.id}
              name={name}
              archived={Boolean(driver.archivedAt)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="Reputation"
          value={`${Math.round(driver.reputation)}%`}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
        <Metric
          title="Distance"
          value={`${driver.totalDistanceKm.toLocaleString()} km`}
          icon={<Route className="h-5 w-5" />}
        />
        <Metric
          title="Deliveries"
          value={driver.totalDeliveries.toLocaleString()}
          icon={<Truck className="h-5 w-5" />}
        />
        <Metric
          title="Joined"
          value={formatDate(driver.joinedAt)}
          icon={<Calendar className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Driver Details
          </h2>

          <dl className="mt-4">
            <Detail label="Email" value={driver.account.email} />
            <Detail label="Role" value={driver.account.role.replaceAll("_", " ")} />
            <Detail
              label="Account"
              value={driver.account.isActive ? "Active" : "Inactive"}
            />
            <Detail
              label="Favourite Truck"
              value={driver.favouriteTruck ?? "Not set"}
            />
            <Detail
              label="Last Login"
              value={formatDate(driver.account.lastLogin)}
            />
          </dl>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Assigned Trucks
          </h2>

          {driver.trucks.length > 0 ? (
            <div className="mt-4 space-y-3">
              {driver.trucks.map((truck) => (
                <Link
                  key={truck.id}
                  href={`/dashboard/fleet/${truck.id}`}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-4 transition hover:border-blue-500/40"
                >
                  <span>
                    <span className="block font-semibold text-white">
                      {truck.fleetNumber}
                    </span>
                    <span className="text-sm text-slate-500">
                      {truck.registration}
                    </span>
                  </span>

                  <Truck className="h-5 w-5 text-blue-400" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-400">
              No trucks are currently assigned to this driver.
            </p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Notes
        </h2>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          {driver.notes ?? "No notes have been recorded for this driver."}
        </p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Operational Modules
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            "Training records",
            "Licence documents",
            "Assignment history",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-slate-800 bg-slate-950 p-5"
            >
              <Mail className="h-5 w-5 text-blue-400" />
              <h3 className="mt-3 font-semibold text-white">
                {item}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Placeholder pending dedicated schema support.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
