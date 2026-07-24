import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DriverProfile from "@/components/drivers/DriverProfile";

import { getDriver } from "@/src/server/drivers/service";

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
  const driver = await getDriver(id);

  if (!driver) {
    notFound();
  }

  return (
    <DashboardLayout
      title="Driver Profile"
      subtitle="Driver record and performance details."
    >
      <DriverProfile driver={driver} />
    </DashboardLayout>
  );
}
