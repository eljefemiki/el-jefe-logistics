"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  RotateCcw,
} from "lucide-react";

import {
  archiveDriverAction,
  restoreDriverAction,
} from "@/src/server/drivers/actions";

interface DriverArchiveButtonProps {
  id: string;
  name: string;
  archived: boolean;
}

export default function DriverArchiveButton({
  id,
  name,
  archived,
}: DriverArchiveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const confirmed = window.confirm(
      archived
        ? `Restore driver ${name}?`
        : `Archive driver ${name}? Their account will be deactivated.`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = archived
        ? await restoreDriverAction(id)
        : await archiveDriverAction(id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  const Icon = archived ? RotateCcw : Archive;

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Icon className="h-4 w-4" />
        {isPending
          ? "Working..."
          : archived
            ? "Restore"
            : "Archive"}
      </button>

      {error && (
        <p className="mt-2 max-w-56 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
