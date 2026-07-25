import type { ContractListingStatus } from "@/src/generated/prisma/enums";

export const listingStatuses = ["DRAFT", "OPEN", "AWARDED", "CLOSED", "CANCELLED"] as const;
export type MarketplaceFilters = { search?: string; status?: ContractListingStatus };
export type ContractListingInput = {
  customerId: string;
  title: string;
  description: string;
  origin: string;
  destination: string;
  cargoType: string;
  cargoCategory: import("@/src/lib/ets2-trailers").CargoCategory;
  requiredTrailer: import("@/src/lib/ets2-trailers").Ets2TrailerType;
  weightKg?: number;
  pickupDate: Date;
  deliveryDate: Date;
  budget: number;
  currency: string;
  contractTerms: string;
  publish: boolean;
};
export type ContractBidInput = {
  amount: number;
  estimatedDays: number;
  proposal: string;
};
