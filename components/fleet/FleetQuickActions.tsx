"use client";

import Link from "next/link";

import Button from "@/components/ui/Button";
import {
  Plus,
  UserPlus,
  Wrench,
  Fuel,
  Upload,
  Download,
} from "lucide-react";

export default function FleetQuickActions() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        <Link href="/dashboard/fleet/new">
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            Add Truck
          </Button>
        </Link>

        <Button variant="secondary" className="justify-start">
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Driver
        </Button>

        <Button variant="secondary" className="justify-start">
          <Wrench className="mr-2 h-4 w-4" />
          Schedule Service
        </Button>

        <Button variant="secondary" className="justify-start">
          <Fuel className="mr-2 h-4 w-4" />
          Fuel Log
        </Button>

        <Button variant="secondary" className="justify-start">
          <Upload className="mr-2 h-4 w-4" />
          Import Fleet
        </Button>

        <Button variant="secondary" className="justify-start">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

      </div>

    </div>
  );
}
