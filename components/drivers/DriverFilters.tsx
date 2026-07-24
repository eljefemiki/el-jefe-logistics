"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  Search,
} from "lucide-react";

export default function DriverFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(
    key: string,
    value: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/dashboard/drivers?${params.toString()}`);
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_170px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

          <input
            type="search"
            defaultValue={searchParams.get("search") ?? ""}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Search name, email, callsign or employee number..."
            className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <select
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(event) =>
            updateFilter("status", event.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="DRIVING">Driving</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="SUSPENDED">Suspended</option>
        </select>

        <select
          defaultValue={searchParams.get("rank") ?? ""}
          onChange={(event) =>
            updateFilter("rank", event.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="">All ranks</option>
          <option value="TRAINEE">Trainee</option>
          <option value="JUNIOR">Junior</option>
          <option value="SENIOR">Senior</option>
          <option value="ELITE">Elite</option>
        </select>

        <button
          type="button"
          onClick={() =>
            updateFilter(
              "includeArchived",
              searchParams.get("includeArchived") === "true"
                ? ""
                : "true",
            )
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <Filter className="h-4 w-4" />
          {searchParams.get("includeArchived") === "true"
            ? "Hide Archived"
            : "Show Archived"}
        </button>
      </div>
    </div>
  );
}
