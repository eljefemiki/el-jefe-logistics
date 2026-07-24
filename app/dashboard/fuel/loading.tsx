export default function FuelLoading() {
  return <div className="min-h-screen bg-slate-950 p-8"><div className="mx-auto max-w-7xl animate-pulse space-y-8"><div className="h-10 w-64 rounded bg-slate-800" /><div className="grid gap-4 sm:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-28 rounded-xl bg-slate-900" />)}</div><div className="h-96 rounded-xl bg-slate-900" /></div></div>;
}
