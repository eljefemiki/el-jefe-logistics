import Link from "next/link";
import {
  Eye,
  Pencil,
  User,
} from "lucide-react";

import type { DriverDTO } from "@/src/server/drivers/types";

import DriverRankBadge from "./DriverRank";
import DriverStatusBadge from "./DriverStatusBadge";

interface DriverTableProps {
  drivers: DriverDTO[];
}

function fullName(driver: DriverDTO) {
  return `${driver.account.firstName} ${driver.account.lastName}`.trim();
}

export default function DriverTable({
  drivers,
}: DriverTableProps) {
  if (drivers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
          <User className="h-7 w-7 text-blue-400" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          No matching drivers
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Try changing the search terms or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-white">
          Driver roster
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {drivers.length}{" "}
          {drivers.length === 1 ? "driver" : "drivers"} shown
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Driver
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Rank
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Reputation
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Distance
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Trucks
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {drivers.map((driver) => (
              <tr
                key={driver.id}
                className="transition hover:bg-slate-800/60"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    href={`/dashboard/drivers/${driver.id}`}
                    className="font-semibold text-white transition hover:text-blue-400"
                  >
                    {fullName(driver)}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    {driver.employeeNumber}
                    {driver.callsign ? ` · ${driver.callsign}` : ""}
                  </p>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <DriverStatusBadge status={driver.status} />
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <DriverRankBadge rank={driver.rank} />
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                  {Math.round(driver.reputation)}%
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                  {driver.totalDistanceKm.toLocaleString()} km
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                  {driver.trucks.length}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/drivers/${driver.id}`}
                      aria-label={`View ${fullName(driver)}`}
                      className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/dashboard/drivers/${driver.id}/edit`}
                      aria-label={`Edit ${fullName(driver)}`}
                      className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
