import Link from "next/link";
import { Newspaper } from "lucide-react";

import Section from "@/components/ui/Section";

export default function Chronicle() {
  return (
    <Section className="bg-slate-950">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center sm:p-12">
        <Newspaper aria-hidden="true" className="mx-auto h-12 w-12 text-blue-400" />
        <h2 className="mt-6 text-4xl font-black text-white sm:text-5xl">Company Chronicle</h2>
        <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-400">
          Verified company news, convoy announcements, and driver milestones will be published here as they happen.
        </p>
        <Link href="/chronicle" className="mt-8 inline-flex h-12 items-center rounded-xl bg-slate-700 px-6 font-semibold text-white hover:bg-slate-600">
          Visit the Chronicle
        </Link>
      </div>
    </Section>
  );
}
