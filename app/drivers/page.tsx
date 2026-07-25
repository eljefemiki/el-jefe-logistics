import Link from "next/link";
import { ClipboardCheck, Map, Users } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

export default function DriversPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.25em] text-blue-400">Drivers</p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">Drive with El Jefe</h1>
            <p className="mt-6 text-xl leading-8 text-slate-400">
              Join an organised virtual trucking community where every driver can participate, develop, and be recognised for genuine achievements.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7"><Map className="h-9 w-9 text-blue-400" /><h2 className="mt-5 text-xl font-bold">Organised journeys</h2><p className="mt-3 text-slate-400">Take part in planned routes and community activities.</p></section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7"><Users className="h-9 w-9 text-blue-400" /><h2 className="mt-5 text-xl font-bold">Supportive community</h2><p className="mt-3 text-slate-400">Learn alongside drivers who value respectful teamwork.</p></section>
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-7"><ClipboardCheck className="h-9 w-9 text-blue-400" /><h2 className="mt-5 text-xl font-bold">Clear progress</h2><p className="mt-3 text-slate-400">Keep your account and operational records together in JefeCore.</p></section>
          </div>
          <div className="mt-14 text-center"><Link href="/register" className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 font-semibold hover:bg-blue-500">Create your account</Link></div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
