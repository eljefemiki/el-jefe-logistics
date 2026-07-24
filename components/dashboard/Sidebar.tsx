import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900">

      <div className="border-b border-slate-800 p-6">

        <h2 className="text-2xl font-black">
          🚛 El Jefe Logistics
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Driver Portal
        </p>

      </div>

      <nav className="p-4 space-y-2">

        <Link href="/dashboard" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          🏠 Dashboard
        </Link>

        <Link href="/dashboard/profile" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          👤 My Profile
        </Link>

        <Link href="/dashboard/achievements" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          🏆 Achievements
        </Link>

        <Link href="/dashboard/deliveries" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          📦 Deliveries
        </Link>

        <Link href="/dashboard/fleet" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          🚛 Fleet
        </Link>

        <Link href="/dashboard/convoys" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          🚚 Convoys
        </Link>

        <Link href="/dashboard/settings" className="block rounded-lg px-4 py-3 hover:bg-slate-800">
          ⚙️ Settings
        </Link>

      </nav>

    </aside>
  );
}