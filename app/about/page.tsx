import Link from "next/link";
import {
  Compass,
  Route,
  ShieldCheck,
  Target,
  Truck,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";

const strategy = [
  {
    title: "Build the operation",
    text: "Use JefeCore to connect drivers, fleet, dispatch, contracts, maintenance, fuel and finance in one accountable system.",
    icon: Truck,
  },
  {
    title: "Grow with purpose",
    text: "Recruit people who value teamwork and reliability, then give them clear opportunities to develop and contribute.",
    icon: Users,
  },
  {
    title: "Earn the reputation",
    text: "Let completed journeys, service quality and consistent standards speak louder than inflated numbers or empty promises.",
    icon: Target,
  },
];

const differences = [
  "A purpose-built operating platform, not just a Discord server and a spreadsheet.",
  "Real links between contracts, drivers, trailers, fleet condition, costs and financial performance.",
  "Progress measured through completed work, reliability and reputation rather than activity alone.",
  "A long-term mindset shaped by experience with Euro Truck Simulator 2 since its inception.",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 py-20 text-white">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-semibold uppercase tracking-[0.25em] text-blue-400">
              About El Jefe Logistics
            </p>
            <h1 className="mt-4 text-5xl font-black sm:text-6xl">
              Building a VTC with purpose.
            </h1>
            <p className="mt-6 text-xl leading-8 text-slate-300">
              El Jefe Logistics is creating a professional, welcoming virtual
              trucking company where every journey contributes to something
              bigger. We combine the community and enjoyment of ETS2 with the
              structure, accountability and ambition of a real logistics
              operation.
            </p>
          </div>

          <section className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 p-8 md:p-12">
            <div className="flex items-center gap-3 text-blue-400">
              <Compass className="h-7 w-7" />
              <p className="font-semibold uppercase tracking-[0.2em]">
                Our statement
              </p>
            </div>
            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-300">
              <p>
                We are building El Jefe Logistics for drivers who want more
                than a name above their truck. Our goal is to create a
                connected company where drivers can take on suitable
                contracts, build a genuine performance record and see how
                their work strengthens the whole fleet.
              </p>
              <p>
                Our strategy is steady, sustainable growth. We will develop
                the systems, standards and culture first, then grow the
                community around them. JefeCore gives us one place to manage
                the full journey—from marketplace contract and trailer
                compatibility through delivery, maintenance, fuel and
                financial results.
              </p>
              <p>
                What makes us different is the depth of that connection. We
                are not chasing impressive-looking numbers or making promises
                we cannot support. We are creating a transparent operation in
                which progress is earned, costs are visible, achievements are
                recorded and every member can understand the part they play.
              </p>
            </div>
          </section>

          <section className="mt-16">
            <div className="mx-auto max-w-3xl text-center">
              <p className="font-semibold uppercase tracking-[0.2em] text-blue-400">
                Our strategy
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Strong foundations before fast growth
              </h2>
            </div>
            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {strategy.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-7"
                  >
                    <Icon className="h-9 w-9 text-blue-400" />
                    <h3 className="mt-5 text-2xl font-bold">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-16 grid gap-8 rounded-3xl border border-slate-800 bg-slate-900 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <div className="flex items-center gap-3 text-blue-400">
                <ShieldCheck className="h-7 w-7" />
                <p className="font-semibold uppercase tracking-[0.2em]">
                  Why we are different
                </p>
              </div>
              <h2 className="mt-5 text-3xl font-bold">
                Experience backed by a clear direction
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Our founder has been playing Euro Truck Simulator 2 since its
                inception. That long-term experience brings an understanding
                of what keeps the game enjoyable, what makes a VTC feel
                worthwhile and where communities often lose their way.
              </p>
            </div>
            <ul className="space-y-4">
              {differences.map((difference) => (
                <li
                  key={difference}
                  className="flex gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-300"
                >
                  <Route className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                  <span className="leading-6">{difference}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 text-center">
            <h2 className="text-3xl font-bold">Every mile should mean something.</h2>
            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
              If you want to help build a dependable, ambitious ETS2 community
              and earn your place through the journeys you complete, we would
              be glad to have you with us.
            </p>
            <Link
              href="/register"
              className="mt-7 inline-flex h-12 items-center rounded-xl bg-blue-600 px-6 font-semibold transition hover:bg-blue-500"
            >
              Join El Jefe Logistics
            </Link>
          </section>
        </Container>
      </main>
      <Footer />
    </>
  );
}
