import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceStats from "@/components/marketplace/MarketplaceStats";
import MarketplaceTable from "@/components/marketplace/MarketplaceTable";
import { requirePermission } from "@/src/lib/auth";
import { getContractMarketplace } from "@/src/server/marketplace/service";
import { listingStatuses } from "@/src/server/marketplace/types";
import type { ContractListingStatus } from "@/src/generated/prisma/enums";
export const dynamic = "force-dynamic";
const one = (value?: string | string[]) => Array.isArray(value) ? value[0] : value;
export default async function MarketplacePage({ searchParams }: { searchParams: Promise<{ search?: string | string[]; status?: string | string[] }> }) {
  await requirePermission("marketplace:view");
  const params = await searchParams; const status = one(params.status);
  const marketplace = await getContractMarketplace({ ...(one(params.search)?.trim() ? { search: one(params.search)!.trim() } : {}), ...(listingStatuses.includes(status as ContractListingStatus) ? { status: status as ContractListingStatus } : {}) });
  return <DashboardLayout title="Contract Marketplace" subtitle="Publish freight opportunities, compare bids and award smart contracts."><div className="space-y-8"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-3xl font-bold text-white">Smart Contract Marketplace</h1><p className="mt-2 text-slate-400">Turn customer demand into governed, competitive freight contracts.</p></div><div className="flex items-center gap-3"><span className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400">v1.1.0</span><Link href="/dashboard/marketplace/new" className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500">Create contract</Link></div></div><MarketplaceStats stats={marketplace.stats} /><MarketplaceFilters /><MarketplaceTable listings={marketplace.listings} /></div></DashboardLayout>;
}
