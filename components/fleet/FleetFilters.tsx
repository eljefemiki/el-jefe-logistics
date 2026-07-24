"use client";

import {
  type FormEvent,
  useState,
  useTransition,
} from "react";

import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

const inputClasses =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

export default function FleetFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, startTransition] = useTransition();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const [status, setStatus] = useState(
    searchParams.get("status") ?? "",
  );

  const [manufacturer, setManufacturer] = useState(
    searchParams.get("manufacturer") ?? "",
  );

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (manufacturer) {
      params.set("manufacturer", manufacturer);
    } else {
      params.delete("manufacturer");
    }

    startTransition(() => {
      const query = params.toString();

      router.push(
        query
          ? `${pathname}?${query}`
          : pathname,
      );
    });
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setManufacturer("");

    startTransition(() => {
      router.push(pathname);
    });
  }

  const filtersActive =
    search.trim() !== "" ||
    status !== "" ||
    manufacturer !== "";

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-xl border border-slate-800 bg-slate-900 p-5"
    >
      <div className="mb-4 flex items-center gap-2">
        <SlidersHorizontal className="h-5 w-5 text-blue-400" />

        <h2 className="font-semibold text-white">
          Search and filters
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search fleet number, registration or model..."
            className={`${inputClasses} pl-11`}
          />
        </div>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className={inputClasses}
        >
          <option value="">
            All statuses
          </option>

          <option value="AVAILABLE">
            Available
          </option>

          <option value="DELIVERING">
            Delivering
          </option>

          <option value="MAINTENANCE">
            Maintenance
          </option>

          <option value="OUT_OF_SERVICE">
            Out of Service
          </option>
        </select>

        <select
          value={manufacturer}
          onChange={(event) =>
            setManufacturer(event.target.value)
          }
          className={inputClasses}
        >
          <option value="">
            All manufacturers
          </option>

          <option value="VOLVO">
            Volvo
          </option>

          <option value="SCANIA">
            Scania
          </option>

          <option value="DAF">
            DAF
          </option>

          <option value="MAN">
            MAN
          </option>

          <option value="MERCEDES">
            Mercedes-Benz
          </option>

          <option value="RENAULT">
            Renault Trucks
          </option>

          <option value="IVECO">
            Iveco
          </option>
        </select>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Applying..." : "Apply"}
        </button>

        <button
          type="button"
          onClick={resetFilters}
          disabled={!filtersActive || pending}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <X className="h-4 w-4" />
          Reset
        </button>
      </div>
    </form>
  );
}