import Link from "next/link";
import { Route, ShieldCheck, Users } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

const principles = [
  { title: "Community", text: "A respectful place where virtual drivers can take part and improve together.", icon: Users },
  { title: "Organisation", text: "Clear fleet, dispatch, maintenance, and commercial workflows through JefeCore.", icon: Route },
  { title: "Honesty", text: "Public milestones are shared when they are real and can be supported.", icon: ShieldCheck },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-semibold uppercase tracking-[0.25em] text-blue-400">About us</p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">Every Mile Earned.</h1>
            <p className="mt-6 text-xl leading-8 text-slate-400">
              El Jefe Logistics is a virtual trucking community supported by JefeCore, our operational platform.
              We are building the company carefully around participation, professional standards, and genuine progress.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {principles.map((principle) => {
              const Icon = principle.icon;
              return <section key={principle.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-7"><Icon className="h-9 w-9 text-blue-400" /><h2 className="mt-5 text-2xl font-bold">{principle.title}</h2><p className="mt-3 leading-7 text-slate-400">{principle.text}</p></section>;
            })}
          </div>
          <div className="mt-14 text-center">
            <Link href="/register" className="inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 font-semibold hover:bg-blue-500">Create an account</Link>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
