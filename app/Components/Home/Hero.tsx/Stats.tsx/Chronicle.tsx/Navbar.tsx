export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="text-xl font-bold text-white">
          🚛 El Jefe Logistics
        </div>

        <nav className="hidden gap-8 text-slate-300 md:flex">
          <a href="#" className="hover:text-white">Home</a>
          <a href="#" className="hover:text-white">Fleet</a>
          <a href="#" className="hover:text-white">Drivers</a>
          <a href="#" className="hover:text-white">Chronicle</a>
        </nav>

        <div className="flex gap-3">
          <button className="rounded-lg px-4 py-2 text-slate-300 hover:text-white">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500">
            Join
          </button>
        </div>
      </div>
    </header>
  );
}