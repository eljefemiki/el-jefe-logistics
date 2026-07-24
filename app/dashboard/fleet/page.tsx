import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";
import FleetFilters from "@/components/fleet/FleetFilters";
import FleetHealth from "@/components/fleet/FleetHealth";
import FleetQuickActions from "@/components/fleet/FleetQuickActions";
import FleetStats from "@/components/fleet/FleetStats";
import TruckTable from "@/components/fleet/TruckTable";

import { getFleet } from "@/src/server/fleet/service";
import { getFleetDashboard } from "@/src/server/fleet/dashboard";

import type {
  FleetFilters as FleetFilterValues,
  FleetTruckManufacturer,
  FleetTruckStatus,
} from "@/src/server/fleet/types";

export const dynamic = "force-dynamic";

interface FleetPageProps {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    manufacturer?: string | string[];
  }>;
}

const validStatuses: FleetTruckStatus[] = [
  "AVAILABLE",
  "DELIVERING",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
];

const validManufacturers: FleetTruckManufacturer[] = [
  "VOLVO",
  "SCANIA",
  "DAF",
  "MAN",
  "MERCEDES",
  "RENAULT",
  "IVECO",
];

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

function isTruckStatus(
  value: string | undefined,
): value is FleetTruckStatus {
  return (
    value !== undefined &&
    validStatuses.includes(value as FleetTruckStatus)
  );
}

function isTruckManufacturer(
  value: string | undefined,
): value is FleetTruckManufacturer {
  return (
    value !== undefined &&
    validManufacturers.includes(
      value as FleetTruckManufacturer,
    )
  );
}

export default async function FleetPage({
  searchParams,
}: FleetPageProps) {
  const params = await searchParams;

  const search = getSingleValue(params.search);
  const status = getSingleValue(params.status);
  const manufacturer = getSingleValue(
    params.manufacturer,
  );

  const filters: FleetFilterValues = {
    ...(search?.trim()
      ? {
          search: search.trim(),
        }
      : {}),

    ...(isTruckStatus(status)
      ? {
          status,
        }
      : {}),

    ...(isTruckManufacturer(manufacturer)
      ? {
          manufacturer,
        }
      : {}),
  };

  const [trucks, dashboard] = await Promise.all([
    getFleet(filters),
    getFleetDashboard(),
  ]);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Fleet
            </h1>

            <p className="mt-2 text-slate-400">
              Search, filter and manage all vehicles in your
              fleet.
            </p>
          </div>

          <Link
            href="/dashboard/fleet/new"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-500"
          >
            Add New Truck
          </Link>
        </div>

        <FleetStats dashboard={dashboard} />

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <FleetQuickActions />
          </div>

          <FleetHealth dashboard={dashboard} />
        </div>

        <FleetFilters />

        <TruckTable trucks={trucks} />
      </div>
    </DashboardLayout>
  );
}
