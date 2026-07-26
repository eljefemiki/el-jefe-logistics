"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore } from "lucide-react";
import { archiveTruckAction } from "@/src/server/fleet/actions";

export default function TruckDeleteButton({
  id,
  fleetNumber,
  archived,
}: {
  id: string;
  fleetNumber: string;
  archived: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!window.confirm(
      archived
        ? `Restore truck ${fleetNumber} to the active fleet?`
        : `Archive truck ${fleetNumber}? Its maintenance, fuel and finance history will be kept.`,
    )) return;
    setError(null);
    startTransition(async () => {
      const result = await archiveTruckAction(id, !archived);
      if (!result.success) return setError(result.message);
      router.push(archived ? `/dashboard/fleet/${id}` : "/dashboard/fleet");
      router.refresh();
    });
  }

  const Icon = archived ? ArchiveRestore : Archive;
  return <div>
    <button type="button" onClick={submit} disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-60">
      <Icon className="h-4 w-4" />
      {pending ? "Saving..." : archived ? "Restore" : "Archive"}
    </button>
    {error && <p className="mt-2 max-w-56 text-xs text-red-300">{error}</p>}
  </div>;
}
