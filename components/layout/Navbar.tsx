import Link from "next/link";
import { Menu, Truck } from "lucide-react";

import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/#fleet", label: "Fleet" },
  { href: "/drivers", label: "Drivers" },
  { href: "/chronicle", label: "Chronicle" },
  { href: "/convoys", label: "Convoys" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/90 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group min-w-0" aria-label="El Jefe Logistics home">
            <div>
              <p className="flex items-center gap-2 text-lg font-black tracking-tight text-white transition group-hover:text-blue-400 sm:text-2xl">
                <Truck aria-hidden="true" className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" />
                <span className="truncate">El Jefe Logistics</span>
              </p>
              <p className="hidden text-sm text-slate-400 sm:block">Every Mile Earned.</p>
            </div>
          </Link>

          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-slate-300 transition hover:text-blue-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Join Now</Button>
            </Link>
          </div>

          <details className="group relative sm:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-lg border border-slate-700 bg-slate-900 p-2 text-white marker:content-none">
              <span className="sr-only">Open main menu</span>
              <Menu aria-hidden="true" className="h-6 w-6" />
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl"
            >
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-4 py-3 text-slate-200 hover:bg-slate-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-800 pt-2">
                <Link href="/login" className="rounded-lg px-3 py-2 text-center text-sm text-slate-200 hover:bg-slate-800">
                  Login
                </Link>
                <Link href="/register" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500">
                  Join
                </Link>
              </div>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  );
}
