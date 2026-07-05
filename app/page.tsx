export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <h1 className="text-6xl font-extrabold">
          🚛 El Jefe Logistics
        </h1>

        <p className="mt-6 max-w-2xl text-xl text-slate-300">
          Every Mile Earned. Every Achievement Remembered.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500">
            Join Today
          </button>

          <button className="rounded-xl border border-slate-600 px-6 py-3 hover:bg-slate-800">
            Login
          </button>
        </div>
      </section>
import Navbar from "@/components/layout/Navbar";
      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-20 md:grid-cols-4">
        {[
          ["Fleet", "0"],
          ["Drivers", "0"],
          ["Contracts", "0"],
          ["Reputation", "100%"],
        ].map(([title, value]) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
          >
            <p className="text-slate-400">{title}</p>
            <h2 className="mt-2 text-3xl font-bold">{value}</h2>
          </div>
        ))}
      </section>
    </main>
  );
}
