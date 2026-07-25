import Link from "next/link";
import { Truck } from "lucide-react";

import Container from "@/components/ui/Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-3">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <Truck aria-hidden="true" className="h-7 w-7 text-blue-400" />
              El Jefe Logistics
            </h2>
            <p className="mt-4 max-w-sm text-slate-400">
              A virtual trucking community built around organised journeys, teamwork, and honest progress.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Explore</h2>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/#fleet" className="hover:text-white">Fleet examples</Link></li>
              <li><Link href="/drivers" className="hover:text-white">Drivers</Link></li>
              <li><Link href="/chronicle" className="hover:text-white">Chronicle</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-lg font-semibold">Account</h2>
            <ul className="space-y-3 text-slate-400">
              <li><Link href="/register" className="hover:text-white">Create an account</Link></li>
              <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
              <li><Link href="/about" className="hover:text-white">About El Jefe</Link></li>
              <li><Link href="/convoys" className="hover:text-white">Convoys</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} El Jefe Logistics. Every Mile Earned.
        </div>
      </Container>
    </footer>
  );
}
