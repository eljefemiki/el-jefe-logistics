CREATE TYPE "ContractListingStatus" AS ENUM ('DRAFT', 'OPEN', 'AWARDED', 'CLOSED', 'CANCELLED');
CREATE TYPE "ContractBidStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

CREATE TABLE "ContractListing" (
  "id" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "origin" TEXT NOT NULL,
  "destination" TEXT NOT NULL,
  "cargoType" TEXT NOT NULL,
  "weightKg" DOUBLE PRECISION,
  "pickupDate" TIMESTAMP(3) NOT NULL,
  "deliveryDate" TIMESTAMP(3) NOT NULL,
  "budget" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'GBP',
  "contractTerms" TEXT NOT NULL,
  "status" "ContractListingStatus" NOT NULL DEFAULT 'DRAFT',
  "awardedBidId" TEXT,
  "publishedAt" TIMESTAMP(3),
  "awardedAt" TIMESTAMP(3),
  "closedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContractListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ContractBid" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "carrierName" TEXT NOT NULL,
  "contactEmail" TEXT NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  "estimatedDays" INTEGER NOT NULL,
  "proposal" TEXT NOT NULL,
  "status" "ContractBidStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContractBid_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ContractListing_reference_key" ON "ContractListing"("reference");
CREATE UNIQUE INDEX "ContractListing_awardedBidId_key" ON "ContractListing"("awardedBidId");
CREATE INDEX "ContractListing_customerId_idx" ON "ContractListing"("customerId");
CREATE INDEX "ContractListing_createdById_idx" ON "ContractListing"("createdById");
CREATE INDEX "ContractListing_status_pickupDate_idx" ON "ContractListing"("status", "pickupDate");
CREATE INDEX "ContractListing_origin_destination_idx" ON "ContractListing"("origin", "destination");
CREATE INDEX "ContractBid_listingId_status_idx" ON "ContractBid"("listingId", "status");
CREATE INDEX "ContractBid_contactEmail_idx" ON "ContractBid"("contactEmail");

ALTER TABLE "ContractListing" ADD CONSTRAINT "ContractListing_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContractListing" ADD CONSTRAINT "ContractListing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ContractListing" ADD CONSTRAINT "ContractListing_awardedBidId_fkey" FOREIGN KEY ("awardedBidId") REFERENCES "ContractBid"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ContractBid" ADD CONSTRAINT "ContractBid_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "ContractListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
