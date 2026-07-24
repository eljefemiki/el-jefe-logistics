"use client";

export default function FleetAlerts() {

  const alerts = [
    {
      level: "Critical",
      message: "Truck EJL-007 requires immediate service",
    },
    {
      level: "Warning",
      message: "2 MOT inspections due this week",
    },
    {
      level: "Info",
      message: "5 trucks are below 25% fuel",
    },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="mb-6 text-xl font-semibold text-white">
        Fleet Alerts
      </h2>

      <div className="space-y-4">

        {alerts.map((alert, index) => (

          <div
            key={index}
            className="rounded-lg border border-slate-800 bg-slate-800/50 p-4"
          >

            <p className="font-semibold text-white">
              {alert.level}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {alert.message}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}