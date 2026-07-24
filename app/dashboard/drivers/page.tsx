import DashboardLayout from "@/components/layout/DashboardLayout";
import DriverFilters from "@/components/drivers/DriverFilters";
import DriverStats from "@/components/drivers/DriverStats";
import DriverTable from "@/components/drivers/DriverTable";

import {
  getDriverDashboard,
  getDrivers,
  isDriverRank,
  isDriverStatus,
} from "@/src/server/drivers/service";

import type { DriverFilters as DriverFilterValues } from "@/src/server/drivers/types";

export const dynamic = "force-dynamic";

interface DriversPageProps {
  searchParams: Promise<{
    search?: string | string[];
    status?: string | string[];
    rank?: string | string[];
    includeArchived?: string | string[];
  }>;
}

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value)
    ? value[0]
    : value;
}

export default async function DriversPage({
  searchParams,
}: DriversPageProps) {
  const params = await searchParams;
  const search = getSingleValue(params.search);
  const status = getSingleValue(params.status);
  const rank = getSingleValue(params.rank);
  const includeArchived =
    getSingleValue(params.includeArchived) === "true";

  const filters: DriverFilterValues = {
    ...(search?.trim()
      ? {
          search: search.trim(),
        }
      : {}),

    ...(isDriverStatus(status)
      ? {
          status,
        }
      : {}),

    ...(isDriverRank(rank)
      ? {
          rank,
        }
      : {}),

    ...(includeArchived
      ? {
          includeArchived,
        }
      : {}),
  };

  const [drivers, dashboard] = await Promise.all([
    getDrivers(filters),
    getDriverDashboard(),
  ]);

  return (
    <DashboardLayout
      title="Driver Centre"
      subtitle="Roster, performance and driver account management."
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Driver Centre
            </h1>

            <p className="mt-2 text-slate-400">
              Search, filter and manage the El Jefe driver roster.
            </p>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">
            Add Driver pending account onboarding flow
          </div>
        </div>

        <DriverStats dashboard={dashboard} />

        <DriverFilters />

        <DriverTable drivers={drivers} />
      </div>
    </DashboardLayout>
  );
}
