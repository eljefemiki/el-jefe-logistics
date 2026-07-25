"use server";

import { revalidatePath } from "next/cache";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "@/src/server/platform/audit";
import { awardContractBid, createContractListing, publishListing, submitContractBid } from "./service";
import { contractBidSchema, contractListingSchema } from "./validation";

export interface MarketplaceActionState {
  success: boolean;
  message: string;
  listingId?: string;
  fieldErrors?: Record<string, string[]>;
}

const text = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => {
  const valueText = text(value);
  if (!valueText) return undefined;
  const parsed = Number(valueText);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const date = (value: FormDataEntryValue | null) => {
  const valueText = text(value);
  if (!valueText) return undefined;
  const parsed = new Date(`${valueText}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export async function createContractListingAction(_state: MarketplaceActionState, formData: FormData): Promise<MarketplaceActionState> {
  const account = await authorize("marketplace:manage");
  const result = contractListingSchema.safeParse({
    customerId: text(formData.get("customerId")) ?? "",
    title: text(formData.get("title")) ?? "",
    description: text(formData.get("description")) ?? "",
    origin: text(formData.get("origin")) ?? "",
    destination: text(formData.get("destination")) ?? "",
    cargoType: text(formData.get("cargoType")) ?? "",
    cargoCategory: text(formData.get("cargoCategory")) ?? "",
    requiredTrailer: text(formData.get("requiredTrailer")) ?? "",
    weightKg: number(formData.get("weightKg")),
    pickupDate: date(formData.get("pickupDate")),
    deliveryDate: date(formData.get("deliveryDate")),
    budget: number(formData.get("budget")),
    currency: text(formData.get("currency")) ?? "GBP",
    contractTerms: text(formData.get("contractTerms")) ?? "",
    publish: formData.get("publish") === "on",
  });
  if (!result.success) return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  try {
    const listing = await createContractListing(account.id, result.data);
    await recordAudit({ action: "CREATE", entityType: "ContractListing", entityId: listing.id, summary: `Created marketplace contract ${listing.reference}`, after: listing });
    revalidatePath("/dashboard/marketplace");
    return { success: true, message: "Contract listing created.", listingId: listing.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to create the listing." };
  }
}

export async function submitContractBidAction(listingId: string, _state: MarketplaceActionState, formData: FormData): Promise<MarketplaceActionState> {
  const account = await authorize("marketplace:view");
  const result = contractBidSchema.safeParse({
    amount: number(formData.get("amount")),
    estimatedDays: number(formData.get("estimatedDays")),
    proposal: text(formData.get("proposal")) ?? "",
  });
  if (!result.success) return { success: false, message: "Please check the bid details.", fieldErrors: result.error.flatten().fieldErrors };
  try {
    const bid = await submitContractBid(listingId, account.id, result.data);
    await recordAudit({ action: "BID", entityType: "ContractListing", entityId: listingId, summary: `Bid submitted by ${bid.carrierName}`, after: bid });
    revalidatePath(`/dashboard/marketplace/${listingId}`);
    return { success: true, message: "Bid submitted for review.", listingId };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to submit the bid." };
  }
}

export async function publishContractListingAction(id: string) {
  const account = await authorize("marketplace:manage");
  const listing = await publishListing(id, account.id);
  await recordAudit({ action: "PUBLISH", entityType: "ContractListing", entityId: id, summary: `Published marketplace contract ${listing.reference}` });
  revalidatePath("/dashboard/marketplace");
  revalidatePath(`/dashboard/marketplace/${id}`);
}

export async function awardContractBidAction(listingId: string, bidId: string) {
  const account = await authorize("marketplace:manage");
  const listing = await awardContractBid(listingId, bidId, account.id);
  await recordAudit({ action: "AWARD", entityType: "ContractListing", entityId: listingId, summary: `Awarded contract ${listing.reference}`, after: listing });
  revalidatePath("/dashboard/marketplace");
  revalidatePath(`/dashboard/marketplace/${listingId}`);
}
