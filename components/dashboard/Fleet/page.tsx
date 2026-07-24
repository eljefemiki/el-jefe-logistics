import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getFleet } from "@/src/server/fleet/service";

export const dynamic = "force-dynamic";

export default async function FleetPage() {
  const trucks = await getFleet();

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Fleet
            </h1>

            <p className="mt-2 text-slate-400">
              View and manage all vehicles in your fleet.
            </p>
          </div>

          <Link
            href="/dashboard/fleet/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Add New Truck
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
          {trucks.length === 0 ? (
            <div className="p-10 text-center">
              <h2 className="text-lg font-semibold text-white">
                No trucks found
              </h2>

              <p className="mt-2 text-slate-400">
                Add your first truck to begin managing the fleet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Fleet number
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Registration
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

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Mileage
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {trucks.map((truck) => (
                    <tr
                      key={truck.id}
                      className="transition hover:bg-slate-800/60"
                    >
                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-white">
                        {truck.fleetNumber}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                        {truck.registration}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                        <div>
                          {truck.manufacturer} {truck.model}
                        </div>

                        <div className="text-sm text-slate-500">
                          {truck.year} · {truck.type}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                          {truck.status.replaceAll("_", " ")}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                        {truck.driver
                          ? `${truck.driver.firstName} ${truck.driver.lastName}`
                          : "Unassigned"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                        {truck.depot?.name ?? "Unassigned"}
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-300">
                        {truck.mileage.toLocaleString()} miles
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-sm text-slate-500">
          {trucks.length} {trucks.length === 1 ? "vehicle" : "vehicles"}
        </p>
      </div>
    </DashboardLayout>
  );
}