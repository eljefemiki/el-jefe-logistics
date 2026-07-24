"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

import {
  LayoutDashboard,
  Truck,
  Users,
  Briefcase,
  PoundSterling,
  Newspaper,
  CalendarDays,
  BarChart3,
  Settings,
  Building2,
  Wrench,
  Fuel,
  ContactRound,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Fleet",
    href: "/dashboard/fleet",
    icon: Truck,
  },
  {
    name: "Drivers",
    href: "/dashboard/drivers",
    icon: Users,
  },
  {
    name: "Dispatch",
    href: "/dashboard/dispatch",
    icon: Briefcase,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: ContactRound,
  },
  {
    name: "Workshop",
    href: "/dashboard/maintenance",
    icon: Wrench,
  },
  {
    name: "Fuel",
    href: "/dashboard/fuel",
    icon: Fuel,
  },
  {
    name: "Finance",
    href: "/dashboard/finance",
    icon: PoundSterling,
  },
  {
    name: "Chronicle",
    href: "/chronicle",
    icon: Newspaper,
  },
  {
    name: "Convoys",
    href: "/convoys",
    icon: CalendarDays,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
      {/* Logo */}
      <div className="border-b border-slate-800 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <Building2 className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-white">
              JefeCore
            </h1>

            <p className="text-sm text-slate-400">
              El Jefe Logistics
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",

                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-5">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Company
          </p>

          <p className="mt-1 font-semibold text-white">
            El Jefe Logistics
          </p>

          <p className="text-sm text-slate-400">
            CEO Dashboard
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[99%] rounded-full bg-emerald-500" />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            Company Health 99%
          </p>
        </div>
      </div>
    </aside>
  );
}
