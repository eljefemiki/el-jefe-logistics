"use client";

import Link from "next/link";

import {
  Plus,
  UserPlus,
  Wrench,
  Fuel,
  Download,
} from "lucide-react";

export default function FleetQuickActions() {
  const actions = [
    { href: "/dashboard/fleet/new", label: "Add Truck", icon: Plus, primary: true },
    { href: "/dashboard/fleet", label: "Manage Assignments", icon: UserPlus },
    { href: "/dashboard/maintenance/new", label: "Schedule Service", icon: Wrench },
    { href: "/dashboard/fuel/new", label: "Fuel Log", icon: Fuel },
    { href: "/api/fleet/export", label: "Export CSV", icon: Download },
  ];
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {actions.map(({ href, label, icon: Icon, primary }) => (
          <Link key={href} href={href}
            className={`inline-flex items-center justify-start rounded-lg px-4 py-2 text-sm font-semibold transition ${primary ? "bg-blue-600 text-white hover:bg-blue-500" : "border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"}`}>
            <Icon className="mr-2 h-4 w-4" />{label}
          </Link>
        ))}

      </div>

    </div>
  );
}
