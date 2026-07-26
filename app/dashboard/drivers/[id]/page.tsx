import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DriverProfile from "@/components/drivers/DriverProfile";
import DriverPerformanceEntryForm from "@/components/drivers/DriverPerformanceEntryForm";

import { getDriver } from "@/src/server/drivers/service";
import { getPerformanceEntryOptions } from "@/src/server/driver-performance/queries";
import { getCurrentAccount } from "@/src/lib/session";
import { hasPermission } from "@/src/lib/permissions";

export const dynamic = "force-dynamic";

interface DriverProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DriverProfilePage({
  params,
}: DriverProfilePageProps) {
  const { id } = await params;
  const [driver, account] = await Promise.all([
    getDriver(id),
    getCurrentAccount(),
  ]);

  if (!driver) {
    notFound();
  }
  const canManage = account
    ? hasPermission(account.role, "drivers:manage")
    : false;
  const [customers, contracts] = canManage
    ? await getPerformanceEntryOptions(driver.id)
    : [[], []];

  return (
    <DashboardLayout
      title="Driver Profile"
      subtitle="Driver record and performance details."
    >
      <DriverProfile driver={driver} />
      {canManage && (
        <div className="mt-8">
          <DriverPerformanceEntryForm
            driverId={driver.id}
            customers={customers}
            contracts={contracts}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
