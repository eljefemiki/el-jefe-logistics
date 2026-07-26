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
  Settings,
  Building2,
  Wrench,
  Fuel,
  ContactRound,
  Bell,
  Search,
  FileText,
  ShieldCheck,
  Store,
  X,
  UserCircle,
  Route,
} from "lucide-react";
import type { UserRole } from "@/src/generated/prisma/enums";
import { hasPermission, type Permission } from "@/src/lib/permissions";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  permission?: Permission;
}

const navigation: NavItem[] = [
  {
    name: "My Profile",
    href: "/profile",
    icon: UserCircle,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Fleet",
    href: "/dashboard/fleet",
    icon: Truck,
    permission: "fleet:view",
  },
  {
    name: "Drivers",
    href: "/dashboard/drivers",
    icon: Users,
    permission: "drivers:view",
  },
  {
    name: "Dispatch",
    href: "/dashboard/dispatch",
    icon: Briefcase,
    permission: "dispatch:view",
  },
  {
    name: "Trucky Jobs",
    href: "/dashboard/jobs",
    icon: Route,
    permission: "dispatch:view",
  },
  {
    name: "Trucky Health",
    href: "/dashboard/settings/integrations/trucky",
    icon: ShieldCheck,
    permission: "settings:view",
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: ContactRound,
    permission: "customers:view",
  },
  {
    name: "Marketplace",
    href: "/dashboard/marketplace",
    icon: Store,
    permission: "marketplace:view",
  },
  {
    name: "Workshop",
    href: "/dashboard/maintenance",
    icon: Wrench,
    permission: "workshop:view",
  },
  {
    name: "Fuel",
    href: "/dashboard/fuel",
    icon: Fuel,
    permission: "fuel:view",
  },
  {
    name: "Finance",
    href: "/dashboard/finance",
    icon: PoundSterling,
    permission: "finance:view",
  },
  { name: "Global Search", href: "/dashboard/search", icon: Search, permission: "dashboard:view" },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, permission: "notifications:view" },
  { name: "Documents", href: "/dashboard/documents", icon: FileText, permission: "documents:view" },
  { name: "Audit Centre", href: "/dashboard/audit", icon: ShieldCheck, permission: "audit:view" },
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
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    permission: "settings:view",
  },
];

interface SidebarProps {
  role: UserRole;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ role, mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const roleLabel = role.replaceAll("_", " ");

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        aria-label="Dashboard navigation"
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 transition-transform lg:sticky lg:top-0 lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
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
          <button
            type="button"
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        {navigation.filter((item) => !item.permission || hasPermission(role, item.permission)).map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
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

          <p className="mt-1 text-sm capitalize text-slate-400">
            {roleLabel.toLowerCase()} workspace
          </p>
        </div>
      </div>
      </aside>
    </>
  );
}
