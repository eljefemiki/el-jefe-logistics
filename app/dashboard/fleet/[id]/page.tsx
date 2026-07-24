import { notFound } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TruckDetails from "@/components/fleet/TruckDetails";
import TruckHeader from "@/components/fleet/TruckHeader";
import TruckOperations from "@/components/fleet/TruckOperations";
import TruckStats from "@/components/fleet/TruckStats";

import { getTruck } from "@/src/server/fleet/service";

export const dynamic = "force-dynamic";

interface TruckProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TruckProfilePage({
  params,
}: TruckProfilePageProps) {
  const { id } = await params;
  const truck = await getTruck(id);

  if (!truck) {
    notFound();
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <TruckHeader truck={truck} />
        <TruckStats truck={truck} />
        <TruckDetails truck={truck} />
        <TruckOperations />
      </div>
    </DashboardLayout>
  );
}
