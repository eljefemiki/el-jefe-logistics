"use client";

import {
  Truck,
  Wrench,
  Fuel,
  UserPlus,
} from "lucide-react";

const activities = [
  {
    icon: Truck,
    title: "New truck added",
    description: "EJL-004 Volvo FH Aero",
    time: "5 minutes ago",
  },
  {
    icon: UserPlus,
    title: "Driver assigned",
    description: "Mike Collis → EJL-001",
    time: "18 minutes ago",
  },
  {
    icon: Fuel,
    title: "Fuel log added",
    description: "Scania S770",
    time: "1 hour ago",
  },
  {
    icon: Wrench,
    title: "Maintenance completed",
    description: "DAF XG+",
    time: "Today",
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="flex items-start gap-4"
            >
              <div className="rounded-lg bg-slate-800 p-3">
                <Icon className="h-5 w-5 text-blue-400" />
              </div>

              <div className="flex-1">

                <p className="font-medium text-white">
                  {activity.title}
                </p>

                <p className="text-sm text-slate-400">
                  {activity.description}
                </p>

              </div>

              <span className="text-xs text-slate-500">
                {activity.time}
              </span>

            </div>
          );
        })}

      </div>

    </div>
  );
}