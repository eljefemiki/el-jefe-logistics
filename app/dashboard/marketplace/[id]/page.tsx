import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Package, ShieldCheck } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ContractBidForm from "@/components/marketplace/ContractBidForm";
import ContractBids from "@/components/marketplace/ContractBids";
import { cargoLabels, trailerLabels } from "@/src/lib/ets2-trailers";
import { requirePermission } from "@/src/lib/auth";
import { publishContractListingAction } from "@/src/server/marketplace/actions";
import { getContractListing } from "@/src/server/marketplace/service";

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const badge: Record<string, string> = {
  DRAFT: "bg-slate-700 text-slate-200",
  OPEN: "bg-emerald-500/15 text-emerald-300",
  AWARDED: "bg-violet-500/15 text-violet-300",
  CLOSED: "bg-blue-500/15 text-blue-300",
  CANCELLED: "bg-red-500/15 text-red-300",
};

export default async function ContractListingPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePermission("marketplace:view");
  const { id } = await params;
  const listing = await getContractListing(id);
  if (!listing) notFound();

  return (
    <DashboardLayout title={listing.reference} subtitle={`${listing.origin} to ${listing.destination}`}>
      <div className="space-y-6">
        <header className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-cyan-950/30 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badge[listing.status]}`}>{listing.status.toLowerCase()}</span>
                <span className="text-sm text-slate-500">{listing.reference}</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">{listing.title}</h1>
              <p className="mt-2 text-slate-400">{listing.customer.companyName}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-slate-400">Contract ceiling</p>
              <p className="mt-1 text-3xl font-bold text-white">{money.format(listing.budget)}</p>
              {listing.status === "DRAFT" && (
                <form action={publishContractListingAction.bind(null, listing.id)}>
                  <button className="mt-4 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500">Publish for bids</button>
                </form>
              )}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-semibold text-white">Contract scope</h2>
              <div className="mt-5 grid gap-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4 sm:grid-cols-2">
                <div><p className="text-xs uppercase tracking-wide text-slate-500">ETS2 cargo category</p><p className="mt-1 font-semibold text-white">{cargoLabels[listing.cargoCategory]}</p></div>
                <div><p className="text-xs uppercase tracking-wide text-slate-500">Required assigned trailer</p><p className="mt-1 font-semibold text-cyan-300">{trailerLabels[listing.requiredTrailer]}</p></div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg bg-slate-950 p-4 text-slate-200">
                <MapPin className="h-5 w-5 text-cyan-400" /><span>{listing.origin}</span><ArrowRight className="h-4 w-4 text-slate-500" /><span>{listing.destination}</span>
              </div>
              <p className="mt-5 whitespace-pre-line text-sm leading-6 text-slate-300">{listing.description}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div><p className="text-xs uppercase text-slate-500">Cargo</p><p className="mt-1 flex items-center gap-2 text-sm text-white"><Package className="h-4 w-4 text-cyan-400" />{listing.cargoType}</p></div>
                <div><p className="text-xs uppercase text-slate-500">Pickup</p><p className="mt-1 flex items-center gap-2 text-sm text-white"><CalendarDays className="h-4 w-4 text-cyan-400" />{listing.pickupDate.toLocaleDateString("en-GB")}</p></div>
                <div><p className="text-xs uppercase text-slate-500">Delivery</p><p className="mt-1 text-sm text-white">{listing.deliveryDate.toLocaleDateString("en-GB")}</p></div>
              </div>
            </section>
            <ContractBids listing={listing} />
          </div>
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-400" /><h2 className="font-semibold text-white">Smart terms</h2></div>
              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-300">{listing.contractTerms}</p>
              {listing.awardedBid && <div className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4"><p className="text-xs uppercase text-emerald-400">Awarded driver</p><p className="mt-1 font-semibold text-white">{listing.awardedBid.carrierName}</p><p className="text-sm text-slate-300">{money.format(listing.awardedBid.amount)}</p></div>}
            </section>
            {listing.status === "OPEN" && <ContractBidForm listingId={listing.id} />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
