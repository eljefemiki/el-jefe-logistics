export default function DashboardHeader() {
  return (
    <header className="border-b border-slate-800 bg-slate-900">

      <div className="flex items-center justify-between px-8 py-6">

        <div>

          <h1 className="text-3xl font-black">
            Dashboard
          </h1>

          <p className="text-slate-400">
            Welcome back to El Jefe Logistics
          </p>

        </div>

        <div className="text-right">

          <p className="font-semibold">
            Mike
          </p>

          <p className="text-sm text-slate-400">
            CEO
          </p>

        </div>

      </div>

    </header>
  );
}