import Link from "next/link";
import { ChevronLeft, Truck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TruckForm from "@/components/fleet/TruckForm";
import { prisma } from "@/src/lib/prisma";

export default async function NewTruckPage() {
  const [depots, driverRows] = await Promise.all([
    prisma.depot.findMany({ select: { id: true, name: true, city: true }, orderBy: { name: "asc" } }),
    prisma.driver.findMany({ where: { status: { not: "SUSPENDED" } }, select: { id: true, employeeNumber: true, account: { select: { firstName: true, lastName: true } } }, orderBy: { employeeNumber: "asc" } }),
  ]);
  const drivers = driverRows.map((driver) => ({ id: driver.id, employeeNumber: driver.employeeNumber, name: `${driver.account.firstName} ${driver.account.lastName}` }));
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <Link
            href="/dashboard/fleet"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Fleet Centre
          </Link>
        </div>

        <div className="flex flex-col gap-5 border-b border-slate-800 pb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <Truck className="h-6 w-6" />
              </div>

              <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                Fleet Management
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Add New Truck
            </h1>

            <p className="mt-3 max-w-2xl text-slate-400">
              Register a new vehicle with El Jefe Logistics and add it to
              the JefeCore fleet management system.
            </p>
          </div>
        </div>

        <TruckForm depots={depots} drivers={drivers} />

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <p className="text-sm text-slate-400">
            After creating the truck, it will automatically be available
            for future depot, driver, maintenance and dispatch assignments.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
