import {
  FileText,
  Fuel,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    title: "Maintenance",
    description:
      "Open and manage persisted inspections, service work and repair jobs in the Workshop Centre.",
    icon: Wrench,
    href: "/dashboard/maintenance",
  },
  {
    title: "Fuel",
    description:
      "Fuel logs can be connected here once the app has a persisted fuel entry model.",
    icon: Fuel,
  },
  {
    title: "Documents",
    description:
      "V5C, insurance, MOT and operating documents are reserved for the document model.",
    icon: FileText,
  },
  {
    title: "Archive",
    description:
      "Archive is pending a Truck archivedAt field. Delete is available today from the profile header.",
    icon: ShieldAlert,
  },
];

export default function TruckOperations() {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="text-xl font-semibold text-white">
        Operational Modules
      </h2>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {modules.map((module) => {
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
                  Open Workshop Centre
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
