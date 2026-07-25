"use client";
import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { submitContractBidAction, type MarketplaceActionState } from "@/src/server/marketplace/actions";
const initial: MarketplaceActionState = { success: false, message: "" };
const input = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500";
export default function ContractBidForm({ listingId }: { listingId: string }) {
  const [state, action, pending] = useActionState(submitContractBidAction.bind(null, listingId), initial);
  if (state.success) return <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-emerald-300"><CheckCircle2 className="h-5 w-5" /><div><p className="font-semibold">Bid received</p><p className="mt-1 text-sm">{state.message}</p></div></div>;
  return <form action={action} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"><div><h2 className="text-lg font-semibold text-white">Submit a bid</h2><p className="mt-1 text-sm text-slate-400">Your price and delivery proposal will be reviewed before award.</p></div>
    <div className="grid gap-4 md:grid-cols-2">
    <div><label htmlFor="amount" className="mb-2 block text-sm text-slate-300">Bid amount</label><input id="amount" name="amount" type="number" min="0.01" step="0.01" required className={input} />{state.fieldErrors?.amount?.[0] && <p className="mt-1 text-xs text-red-400">{state.fieldErrors.amount[0]}</p>}</div><div><label htmlFor="estimatedDays" className="mb-2 block text-sm text-slate-300">Estimated days</label><input id="estimatedDays" name="estimatedDays" type="number" min="1" required className={input} />{state.fieldErrors?.estimatedDays?.[0] && <p className="mt-1 text-xs text-red-400">{state.fieldErrors.estimatedDays[0]}</p>}</div>
    <div className="md:col-span-2"><label htmlFor="proposal" className="mb-2 block text-sm text-slate-300">Fulfilment proposal</label><textarea id="proposal" name="proposal" rows={4} required className={input} />{state.fieldErrors?.proposal?.[0] && <p className="mt-1 text-xs text-red-400">{state.fieldErrors.proposal[0]}</p>}</div></div>
    {state.message && <div className="flex gap-2 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{state.message}</div>}<button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Submit bid</button>
  </form>;
}
