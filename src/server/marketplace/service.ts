import { acceptContractBid, findContractListing, findContractListings, findMarketplaceCustomers, insertContractBid, insertContractListing, publishContractListing } from "./repository";
import type { ContractBidInput, ContractListingInput, MarketplaceFilters } from "./types";

export async function getContractMarketplace(filters: MarketplaceFilters = {}) {
  const listings = await findContractListings(filters);
  const active = listings.filter((listing) => ["OPEN", "AWARDED"].includes(listing.status));
  return {
    listings,
    stats: {
      open: listings.filter((listing) => listing.status === "OPEN").length,
      awarded: listings.filter((listing) => listing.status === "AWARDED").length,
      liveValue: active.reduce((sum, listing) => sum + listing.budget, 0),
      bids: listings.reduce((sum, listing) => sum + listing.bids.length, 0),
    },
  };
}

export { findContractListing as getContractListing, findMarketplaceCustomers as getMarketplaceCustomers };
export const submitContractBid = (listingId: string, accountId: string, data: ContractBidInput) => insertContractBid(listingId, accountId, data);
export const publishListing = (id: string, createdById: string) => publishContractListing(id, createdById);
export const awardContractBid = (listingId: string, bidId: string, createdById: string) => acceptContractBid(listingId, bidId, createdById);

export function createContractListing(createdById: string, data: ContractListingInput) {
  const reference = `CTR-${new Date().getFullYear()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
  return insertContractListing(reference, createdById, data);
}
