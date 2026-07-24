import Link from "next/link";
import { User } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DriverNotFound() {
  return (
    <DashboardLayout
      title="Driver Not Found"
      subtitle="The requested driver could not be loaded."
    >
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
            <User className="h-7 w-7 text-blue-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Driver not found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            This driver no longer exists or the driver ID is invalid.
          </p>

          <Link
            href="/dashboard/drivers"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Back to Driver Centre
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
