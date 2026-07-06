import Navbar from "../components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-950 text-white">

        <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-32 text-center">

          <h1 className="text-6xl font-black leading-tight">
            The Next Generation
            <br />
            Virtual Trucking Company
          </h1>

          <p className="mt-8 max-w-2xl text-xl text-slate-400">
            Build your career.
            Drive the world's roads.
            Earn achievements.
            Leave your legacy.
          </p>

          <div className="mt-12 flex gap-4">

            <button className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500">
              Join El Jefe
            </button>

            <button className="rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-900">
              Learn More
            </button>

          </div>

        </section>

      </main>
    </>
  );
}