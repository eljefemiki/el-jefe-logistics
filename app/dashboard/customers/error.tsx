"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";

export default function CustomerError({ reset }: { reset: () => void }) {
  return <DashboardLayout title="Customer CRM" subtitle="Customer accounts are temporarily unavailable."><div className="mx-auto max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 p-8 text-center"><h1 className="text-xl font-semibold text-white">Unable to load customers</h1><p className="mt-2 text-sm text-red-200">Check the database connection and try again.</p><button onClick={reset} className="mt-5 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400">Try again</button></div></DashboardLayout>;
}
