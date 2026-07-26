import Link from "next/link";
import {
  ChevronLeft,
  Pencil,
  Truck,
} from "lucide-react";

import type { FleetTruckDTO } from "@/src/server/fleet/types";

import TruckStatusBadge from "./TruckStatusBadge";
import TruckDeleteButton from "./TruckDeleteButton";

interface TruckHeaderProps {
  truck: FleetTruckDTO;
}

function formatManufacturer(value: string) {
  if (value === "MERCEDES") {
    return "Mercedes-Benz";
  }

  return (
    value.charAt(0) +
    value.slice(1).toLowerCase()
  );
}

export default function TruckHeader({
  truck,
}: TruckHeaderProps) {
  return (
    <div className="space-y-6 border-b border-slate-800 pb-8">
      <Link
        href="/dashboard/fleet"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Fleet Centre
      </Link>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Truck className="h-7 w-7" />
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <TruckStatusBadge status={truck.status} />

              <span className="text-sm font-medium text-slate-500">
                {truck.registration}
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              {truck.fleetNumber}
            </h1>

            <p className="mt-3 text-slate-400">
              {formatManufacturer(truck.manufacturer)} {truck.model} -{" "}
              {truck.year} - {truck.type.replaceAll("_", " ")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/dashboard/fleet/${truck.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Pencil className="h-4 w-4" />
            Edit Truck
          </Link>

          <TruckDeleteButton
            id={truck.id}
            fleetNumber={truck.fleetNumber}
            archived={Boolean(truck.archivedAt)}
          />
        </div>
      </div>
    </div>
  );
}
