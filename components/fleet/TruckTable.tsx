import Link from "next/link";

import {
  Eye,
  Fuel,
  Pencil,
  Truck,
} from "lucide-react";

import type { FleetTruckDTO } from "@/src/server/fleet/types";

import TruckStatusBadge from "./TruckStatusBadge";

interface TruckTableProps {
  trucks: FleetTruckDTO[];
}

function formatManufacturer(value: string) {
  if (value === "MERCEDES") {
    return "Mercedes-Benz";
  }

  return (
    value.charAt(0) +
    value.slice(1).toLowerCase()
  );
}

export default function TruckTable({
  trucks,
}: TruckTableProps) {
  if (trucks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
          <Truck className="h-7 w-7 text-blue-400" />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-white">
          No matching trucks
        </h3>

        <p className="mt-2 text-sm text-slate-400">
          Try changing the search terms or filters, or add a
          new vehicle to the fleet.
        </p>

        <Link
          href="/dashboard/fleet/new"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Add New Truck
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
      <div className="border-b border-slate-800 px-6 py-5">
        <h2 className="text-xl font-semibold text-white">
          Fleet vehicles
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {trucks.length}{" "}
          {trucks.length === 1 ? "vehicle" : "vehicles"} shown
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-950">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fleet number
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Vehicle
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Driver
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Depot
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Fuel
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Mileage
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Value
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {trucks.map((truck) => (
              <tr
                key={truck.id}
                className="transition hover:bg-slate-800/60"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    href={`/dashboard/fleet/${truck.id}`}
                    className="font-semibold text-white transition hover:text-blue-400"
                  >
                    {truck.fleetNumber}
                  </Link>

                  <p className="mt-1 text-sm text-slate-500">
                    {truck.registration}
                  </p>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-800 p-2 text-blue-400">
                      <Truck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-medium text-slate-200">
                        {formatManufacturer(
                          truck.manufacturer,
                        )}{" "}
                        {truck.model}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {truck.year} ·{" "}
                        {truck.type.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <TruckStatusBadge
                    status={truck.status}
                  />
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                  {truck.driver
                    ? `${truck.driver.firstName} ${truck.driver.lastName}`
                    : "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                  {truck.depot?.name ?? "Unassigned"}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="inline-flex items-center gap-2 text-slate-300">
                    <Fuel className="h-4 w-4 text-slate-500" />

                    <span>
                      {truck.fuelLevel}%
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                  {truck.mileage.toLocaleString()} miles
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-300">
                  {truck.currentValue !== null
                    ? truck.currentValue.toLocaleString(
                        "en-GB",
                        {
                          style: "currency",
                          currency: "GBP",
                          maximumFractionDigits: 0,
                        },
                      )
                    : "Not set"}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/dashboard/fleet/${truck.id}`}
                      aria-label={`View ${truck.fleetNumber}`}
                      className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/dashboard/fleet/${truck.id}/edit`}
                      aria-label={`Edit ${truck.fleetNumber}`}
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