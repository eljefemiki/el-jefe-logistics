import Link from "next/link";
import { CalendarDays } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

export default function ConvoysPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <CalendarDays className="mx-auto h-14 w-14 text-blue-400" />
            <h1 className="mt-6 text-5xl font-black sm:text-6xl">Community Convoys</h1>
            <p className="mt-6 text-xl leading-8 text-slate-400">
              Confirmed convoy dates, routes, and participation details will appear here once scheduled.
            </p>
            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-8">
              <h2 className="text-2xl font-bold">No convoy currently scheduled</h2>
              <p className="mt-3 text-slate-400">Create an account to be ready for future community activities.</p>
              <Link href="/register" className="mt-7 inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 font-semibold hover:bg-blue-500">Create an account</Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
