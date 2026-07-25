import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";

import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

export default function DriverSpotlight() {
  return (
    <Section className="bg-slate-950">
      <div className="mb-12 text-center">
        <p className="font-semibold uppercase tracking-[0.25em] text-blue-400">Our approach</p>
        <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">People before numbers</h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          We publish genuine milestones when they are earned. Until then, our focus stays on building a
          dependable, welcoming virtual trucking community.
        </p>
      </div>

      <Card className="mx-auto max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-800 p-7">
            <Users aria-hidden="true" className="h-10 w-10 text-blue-400" />
            <h3 className="mt-5 text-2xl font-bold text-white">Driver-led community</h3>
            <p className="mt-3 leading-7 text-slate-300">
              Members can take part in organised journeys, develop their experience, and help shape the company.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-800 p-7">
            <ShieldCheck aria-hidden="true" className="h-10 w-10 text-emerald-400" />
            <h3 className="mt-5 text-2xl font-bold text-white">Honest by design</h3>
            <p className="mt-3 leading-7 text-slate-300">
              Public claims are kept clear and verifiable, while operational information remains protected.
            </p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/register"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Create an account
          </Link>
        </div>
      </Card>
    </Section>
  );
}
