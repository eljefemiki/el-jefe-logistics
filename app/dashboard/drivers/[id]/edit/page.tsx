import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Pencil,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DriverForm from "@/components/drivers/DriverForm";

import { getDriver } from "@/src/server/drivers/service";

export const dynamic = "force-dynamic";

interface EditDriverPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditDriverPage({
  params,
}: EditDriverPageProps) {
  const { id } = await params;
  const driver = await getDriver(id);

  if (!driver) {
    notFound();
  }

  const name =
    `${driver.account.firstName} ${driver.account.lastName}`.trim();

  return (
    <DashboardLayout
      title="Edit Driver"
      subtitle="Update roster and account details."
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Link
            href={`/dashboard/drivers/${driver.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Driver Profile
          </Link>
        </div>

        <div className="flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Pencil className="h-6 w-6" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Driver Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Edit {name}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Update account details, roster status and driver performance totals.
            </p>
          </div>
        </div>

        <DriverForm driver={driver} />
      </div>
    </DashboardLayout>
  );
}
