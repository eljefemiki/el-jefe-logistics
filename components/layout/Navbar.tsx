import Link from "next/link";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white transition group-hover:text-blue-400">
                🚛 El Jefe Logistics
              </h1>

              <p className="text-sm text-slate-400">Every Mile Earned.</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-8 lg:flex"
          >
            <Link
              href="/"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Home
            </Link>

            <Link
              href="/dashboard/fleet"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Fleet
            </Link>

            <Link
              href="/drivers"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Drivers
            </Link>

            <Link
              href="/chronicle"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Chronicle
            </Link>

            <Link
              href="/convoys"
              className="text-slate-300 transition hover:text-blue-400"
            >
              Convoys
            </Link>

            <Link
              href="/about"
              className="text-slate-300 transition hover:text-blue-400"
            >
              About
            </Link>
          </nav>

          {/* Right-side buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>

            <Link href="/join">
              <Button>Join Now</Button>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}