import Link from "next/link";
import { Truck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-blue-400">
            El Jefe Logistics
          </p>
          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
            Drive Further.
            <br />
            Achieve More.
            <br />
            Together.
          </h1>
          <p className="mt-8 max-w-xl text-xl leading-8 text-slate-400">
            Join a growing virtual trucking community focused on organised journeys,
            professional standards, and enjoying every mile together.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 text-lg font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Apply Today
            </Link>
            <Link
              href="/#fleet"
              className="inline-flex h-12 items-center rounded-xl bg-slate-700 px-6 text-lg font-semibold text-white transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Explore Fleet
            </Link>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex h-[360px] w-full max-w-lg items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl sm:h-[450px]">
            <div className="text-center">
              <Truck aria-hidden="true" className="mx-auto h-20 w-20 text-blue-400" />
              <h2 className="mt-6 text-2xl font-bold text-white">European road freight</h2>
              <p className="mt-2 text-slate-400">Virtual fleet operations powered by JefeCore</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
