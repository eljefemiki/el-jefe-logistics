import Link from "next/link";
import Section from "@/components/ui/Section";

export default function CTA() {
  return (
    <Section className="bg-gradient-to-r from-blue-700 to-slate-900">

      <div className="text-center">

        <h2 className="text-5xl font-black text-white">
          Ready to Begin Your Journey?
        </h2>

        <p className="mt-6 text-xl text-slate-200">
          Create your account and become part of the El Jefe Logistics virtual trucking community.
        </p>

        <div className="mt-10">
          <Link href="/register" className="inline-flex h-12 items-center rounded-xl bg-white px-6 text-lg font-semibold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white">
            Apply Today
          </Link>
        </div>

      </div>

    </Section>
  );
}
