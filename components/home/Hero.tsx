import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-slate-950" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2">

        <div>

          <p className="mb-4 font-semibold uppercase tracking-[0.3em] text-blue-400">
            El Jefe Logistics
          </p>

          <h1 className="text-6xl font-black leading-tight text-white">
            Drive Further.
            <br />
            Achieve More.
            <br />
            Together.
          </h1>

          <p className="mt-8 max-w-xl text-xl leading-8 text-slate-400">
            Join one of Europe&apos;s fastest growing virtual trucking companies
            and build your legacy one delivery at a time.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            <Button>
              Apply Today
            </Button>

            <Button variant="secondary">
              Explore Fleet
            </Button>
          </div>

        </div>

        <div className="flex justify-center">

          <div className="flex h-[450px] w-full max-w-lg items-center justify-center rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

            <div className="text-center">

              <div className="text-7xl">
                🚛
              </div>

              <h3 className="mt-6 text-2xl font-bold text-white">
                Volvo FH Aero
              </h3>

              <p className="mt-2 text-slate-400">
                Premium Fleet Preview
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
