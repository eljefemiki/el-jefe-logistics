"use client";
export default function FuelError({ reset }: { reset: () => void }) {
  return <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8"><div className="max-w-md rounded-xl border border-red-500/30 bg-slate-900 p-8 text-center"><h1 className="text-xl font-bold text-white">Fuel Centre unavailable</h1><p className="mt-2 text-sm text-slate-400">We could not load fuel activity. Check the database connection and try again.</p><button onClick={reset} className="mt-6 rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500">Try again</button></div></div>;
}
