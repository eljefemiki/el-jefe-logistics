"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArchiveRestore, Archive } from "lucide-react";
import { archiveCustomerAction, restoreCustomerAction } from "@/src/server/customers/actions";

export default function CustomerArchiveButton({ id, archived }: { id: string; archived: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const action = archived ? restoreCustomerAction : archiveCustomerAction;
  return <button disabled={pending} onClick={() => startTransition(async () => { await action(id); router.refresh(); })} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-60">{archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}{pending ? "Saving…" : archived ? "Restore customer" : "Archive customer"}</button>;
}
