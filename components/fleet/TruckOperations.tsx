import {
  FileText,
  Fuel,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import Link from "next/link";

function getModules(truckId: string) { return [
  {
    title: "Maintenance",
    description:
      "Open and manage persisted inspections, service work and repair jobs in the Workshop Centre.",
    icon: Wrench,
    href: `/dashboard/maintenance/new?truckId=${truckId}`,
  },
  {
    title: "Fuel",
    description:
      "Record a persisted fuel transaction against this truck.",
    icon: Fuel,
    href: `/dashboard/fuel/new?truckId=${truckId}`,
  },
  {
    title: "Documents",
    description:
      "Open document metadata and external file links associated with fleet records.",
    icon: FileText,
    href: `/dashboard/documents?entityType=Truck&entityId=${truckId}`,
  },
  {
    title: "Archive",
    description:
      "Use Archive in the profile header to remove this truck from active totals while retaining its full history.",
    icon: ShieldAlert,
  },
];}

export default function TruckOperations({ truckId }: { truckId: string }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">
        Operational Modules
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {getModules(truckId).map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.title}
              className="rounded-lg border border-slate-800 bg-slate-950 p-5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-semibold text-white">
                  {module.title}
                </h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                {module.description}
              </p>
              {module.href && (
                <Link href={module.href} className="mt-4 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">
                  Open module
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
