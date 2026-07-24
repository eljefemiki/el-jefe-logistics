import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
          <SearchX className="h-8 w-8 text-blue-400" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-white">
          Page Not Found
        </h1>

        <p className="mt-3 text-slate-400">
          The JefeCore page you&apos;re looking for could not be found.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Return Home
        </Link>
      </div>
    </main>
  );
}