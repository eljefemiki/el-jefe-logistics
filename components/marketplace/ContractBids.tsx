import { Award, CheckCircle2 } from "lucide-react";

import { awardContractBidAction } from "@/src/server/marketplace/actions";
import { trailerLabels } from "@/src/lib/ets2-trailers";

type Listing = NonNullable<Awaited<ReturnType<typeof import("@/src/server/marketplace/service").getContractListing>>>;
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

export default function ContractBids({ listing }: { listing: Listing }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Compatible driver bids</h2>
          <p className="mt-1 text-sm text-slate-400">
            {listing.bids.length} verified proposal{listing.bids.length === 1 ? "" : "s"} received
          </p>
        </div>
        <Award className="h-5 w-5 text-amber-400" />
      </div>
      <div className="mt-5 space-y-3">
        {listing.bids.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-700 p-6 text-center text-sm text-slate-500">
            No compatible driver bids yet.
          </p>
        ) : listing.bids.map((bid) => (
          <div key={bid.id} className={`rounded-lg border p-4 ${bid.status === "ACCEPTED" ? "border-emerald-500/40 bg-emerald-500/10" : "border-slate-800 bg-slate-950"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{bid.carrierName}</p>
                  {bid.status === "ACCEPTED" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {bid.contactEmail} · {bid.estimatedDays} day estimate
                  {bid.trailerType ? ` · ${trailerLabels[bid.trailerType]}` : ""}
                </p>
                <p className="mt-3 text-sm text-slate-300">{bid.proposal}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-white">{money.format(bid.amount)}</p>
                <p className="text-xs capitalize text-slate-500">{bid.status.toLowerCase()}</p>
                {listing.status === "OPEN" && bid.status === "PENDING" && (
                  <form action={awardContractBidAction.bind(null, listing.id, bid.id)}>
                    <button className="mt-3 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500">
                      Award contract
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
