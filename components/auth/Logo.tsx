import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-3"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white">
        EJ
      </div>

      <div>
        <h2 className="text-xl font-black text-white">
          EL JEFE
        </h2>

        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          Logistics
        </p>
      </div>
    </Link>
  );
}