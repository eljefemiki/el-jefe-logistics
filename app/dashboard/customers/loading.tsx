import DashboardLayout from "@/components/layout/DashboardLayout";

export default function LoadingCustomers() {
  return <DashboardLayout title="Customer CRM" subtitle="Loading customer accounts."><div className="mx-auto max-w-7xl animate-pulse space-y-6"><div className="h-10 w-64 rounded bg-slate-800" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="h-28 rounded-xl bg-slate-900" />)}</div><div className="h-80 rounded-xl bg-slate-900" /></div></DashboardLayout>;
}
