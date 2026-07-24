"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import Button from "@/components/ui/Button";

export default function FleetHeader() {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Fleet Centre
        </h1>

        <p className="mt-2 text-slate-400">
          Manage your company&apos;s trucks, trailers and fleet assets.
        </p>
      </div>

      <Link href="/dashboard/fleet/new">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Truck
        </Button>
      </Link>
    </div>
  );
}