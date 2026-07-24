import Link from "next/link";
import { Truck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function TruckNotFound() {
  return (
    <DashboardLayout>
      <div className="flex min-h-[500px] items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
            <Truck className="h-7 w-7 text-blue-400" />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white">
            Truck not found
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            This truck no longer exists or the fleet ID is invalid.
          </p>

          <Link
            href="/dashboard/fleet"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Back to Fleet Centre
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
