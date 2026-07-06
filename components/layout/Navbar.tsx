export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            🚛 El Jefe Logistics
          </h1>

          <p className="text-sm text-slate-400">
            Every Mile Earned.
          </p>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-300 hover:text-white">
            Home
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Fleet
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Drivers
          </a>

          <a href="#" className="text-slate-300 hover:text-white">
            Chronicle
          </a>
        </nav>

        <div className="flex gap-3">
          <button className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-500">
            Join
          </button>
        </div>
      </div>
    </header>
  );
}