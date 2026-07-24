"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteTruckAction } from "@/src/server/fleet/actions";

interface TruckDeleteButtonProps {
  id: string;
  fleetNumber: string;
}

export default function TruckDeleteButton({
  id,
  fleetNumber,
}: TruckDeleteButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete truck ${fleetNumber}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await deleteTruckAction(id);

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.push("/dashboard/fleet");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="h-4 w-4" />
        {isPending ? "Deleting..." : "Delete"}
      </button>

      {error && (
        <p className="mt-2 max-w-48 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
