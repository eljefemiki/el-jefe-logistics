export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400">
          Welcome to El Jefe Logistics
        </span>

        <h1 className="mt-8 text-6xl font-black leading-tight md:text-7xl">
          Drive Beyond
          <br />
          <span className="text-blue-500">Limits.</span>
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-400">
          Join one of Europe's most ambitious Virtual Trucking Companies.
          Complete contracts, earn achievements, grow your career,
          and become part of a community that values professionalism,
          teamwork and adventure.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button className="rounded-xl bg-blue-600 px-8 py-4 font-bold transition hover:bg-blue-500">
            Start Driving
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 transition hover:bg-slate-900">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}