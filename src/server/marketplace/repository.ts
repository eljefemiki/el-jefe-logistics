import { prisma } from "@/src/lib/prisma";
import type { ContractBidInput, ContractListingInput, MarketplaceFilters } from "./types";

const include = {
  customer: { select: { id: true, customerNumber: true, companyName: true } },
  createdBy: { select: { id: true, firstName: true, lastName: true } },
  awardedBid: true,
  bids: { orderBy: { amount: "asc" as const } },
} as const;

export function findContractListings(filters: MarketplaceFilters = {}) {
  return prisma.contractListing.findMany({
    where: {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search ? { OR: [
        { reference: { contains: filters.search, mode: "insensitive" } },
        { title: { contains: filters.search, mode: "insensitive" } },
        { origin: { contains: filters.search, mode: "insensitive" } },
        { destination: { contains: filters.search, mode: "insensitive" } },
        { customer: { companyName: { contains: filters.search, mode: "insensitive" } } },
      ] } : {}),
    },
    include,
    orderBy: [{ status: "asc" }, { pickupDate: "asc" }],
  });
}

export function findContractListing(id: string) {
  return prisma.contractListing.findUnique({ where: { id }, include });
}

export function findMarketplaceCustomers() {
  return prisma.customer.findMany({
    where: { archivedAt: null, status: "ACTIVE" },
    select: { id: true, customerNumber: true, companyName: true },
    orderBy: { companyName: "asc" },
  });
}

export function insertContractListing(reference: string, createdById: string, data: ContractListingInput) {
  const { publish, ...values } = data;
  return prisma.contractListing.create({
    data: { ...values, reference, createdById, status: publish ? "OPEN" : "DRAFT", publishedAt: publish ? new Date() : null },
    include,
  });
}

export async function insertContractBid(listingId: string, accountId: string, data: ContractBidInput) {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.contractListing.findFirst({
      where: { id: listingId, status: "OPEN" },
      select: { id: true, requiredTrailer: true },
    });
    if (!listing) throw new Error("This contract is not open for bids.");

    const driver = await tx.driver.findFirst({
      where: { accountId, archivedAt: null, account: { isActive: true } },
      select: {
        id: true,
        assignedTrailer: true,
        account: { select: { firstName: true, lastName: true, email: true } },
      },
    });
    if (!driver) throw new Error("Only an active driver can bid for a contract.");
    if (!driver.assignedTrailer) throw new Error("A trailer must be assigned to your driver profile before bidding.");
    if (driver.assignedTrailer !== listing.requiredTrailer) {
      throw new Error("Your assigned trailer is not compatible with this contract.");
    }

    return tx.contractBid.create({
      data: {
        ...data,
        listingId,
        driverId: driver.id,
        trailerType: driver.assignedTrailer,
        carrierName: `${driver.account.firstName} ${driver.account.lastName}`.trim(),
        contactEmail: driver.account.email,
      },
    });
  });
}

export function publishContractListing(id: string, createdById: string) {
  return prisma.contractListing.update({ where: { id, status: "DRAFT", createdById }, data: { status: "OPEN", publishedAt: new Date() }, include });
}

export async function acceptContractBid(listingId: string, bidId: string, createdById: string) {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.contractListing.findFirst({ where: { id: listingId, createdById }, select: { status: true } });
    const bid = await tx.contractBid.findFirst({ where: { id: bidId, listingId, status: "PENDING" } });
    if (!listing || listing.status !== "OPEN" || !bid) throw new Error("This bid can no longer be awarded.");
    await tx.contractBid.updateMany({ where: { listingId, id: { not: bidId }, status: "PENDING" }, data: { status: "REJECTED" } });
    await tx.contractBid.update({ where: { id: bidId }, data: { status: "ACCEPTED" } });
    return tx.contractListing.update({
      where: { id: listingId },
      data: { status: "AWARDED", awardedBidId: bidId, awardedAt: new Date() },
      include,
    });
  });
}
