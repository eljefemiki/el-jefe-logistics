import Link from "next/link";
export default function FuelEntryNotFound() {
  return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8"><div className="text-center"><h1 className="text-3xl font-bold text-white">Fuel entry not found</h1><p className="mt-2 text-slate-400">This transaction does not exist or is no longer available.</p><Link href="/dashboard/fuel" className="mt-6 inline-block rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white">Return to Fuel Centre</Link></div></div>;
}
