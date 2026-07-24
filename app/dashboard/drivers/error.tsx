"use client";

import {
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface DriversErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function DriversError({
  error,
  reset,
}: DriversErrorProps) {
  return (
    <div className="flex min-h-[500px] items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border border-red-500/20 bg-slate-900 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-white">
          Driver Centre Error
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          JefeCore encountered a problem while loading the Driver Centre.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4 text-left">
            <p className="break-words text-xs text-red-300">
              {error.message}
            </p>

            {error.digest && (
              <p className="mt-2 text-xs text-slate-500">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={reset}
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
