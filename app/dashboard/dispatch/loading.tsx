import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DispatchLoading() {
  return (
    <DashboardLayout
      title="Dispatch Centre"
      subtitle="Loading dispatch readiness..."
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl bg-slate-900"
            />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="h-[640px] animate-pulse rounded-xl bg-slate-900 xl:col-span-2" />
          <div className="h-[640px] animate-pulse rounded-xl bg-slate-900" />
        </div>
      </div>
    </DashboardLayout>
  );
}
