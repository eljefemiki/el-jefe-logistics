import Button from "@/components/ui/Button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            🚛 El Jefe Logistics
          </h1>

          <p className="text-sm text-blue-400">
            Every Mile Earned.
          </p>
        </div>

        {/* Navigation */}

        <nav className="hidden items-center gap-8 lg:flex">

          <a href="#" className="transition hover:text-blue-400">
            Home
          </a>

          <a href="#" className="transition hover:text-blue-400">
            Fleet
          </a>

          <a href="#" className="transition hover:text-blue-400">
            Drivers
          </a>

          <a href="#" className="transition hover:text-blue-400">
            Chronicle
          </a>

          <a href="#" className="transition hover:text-blue-400">
            Convoys
          </a>

        </nav>

        {/* Buttons */}

        <div className="flex gap-3">

          <Button variant="secondary">
            Login
          </Button>

          <Button>
            Join Now
          </Button>

        </div>

      </div>
    </header>
  );
}