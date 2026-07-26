ALTER TABLE "Account"
ADD COLUMN "profileImage" BYTEA,
ADD COLUMN "profileImageMime" TEXT,
ADD COLUMN "profileImageUpdatedAt" TIMESTAMP(3);

CREATE TABLE "DriverPerformanceEntry" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "contractListingId" TEXT,
    "distanceKm" INTEGER NOT NULL,
    "cargoTonnes" DOUBLE PRECISION NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "expenditure" DOUBLE PRECISION NOT NULL,
    "reputationScore" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "recordedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DriverPerformanceEntry_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DriverPerformanceEntry_values_check" CHECK (
      "distanceKm" > 0
      AND "cargoTonnes" >= 0
      AND "income" >= 0
      AND "expenditure" >= 0
      AND "reputationScore" >= 0
      AND "reputationScore" <= 100
    )
);

CREATE UNIQUE INDEX "DriverPerformanceEntry_contractListingId_key"
ON "DriverPerformanceEntry"("contractListingId");

CREATE INDEX "DriverPerformanceEntry_driverId_completedAt_idx"
ON "DriverPerformanceEntry"("driverId", "completedAt");

CREATE INDEX "DriverPerformanceEntry_customerId_idx"
ON "DriverPerformanceEntry"("customerId");

CREATE INDEX "DriverPerformanceEntry_recordedById_idx"
ON "DriverPerformanceEntry"("recordedById");

ALTER TABLE "DriverPerformanceEntry"
ADD CONSTRAINT "DriverPerformanceEntry_driverId_fkey"
FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "DriverPerformanceEntry"
ADD CONSTRAINT "DriverPerformanceEntry_customerId_fkey"
FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "DriverPerformanceEntry"
ADD CONSTRAINT "DriverPerformanceEntry_contractListingId_fkey"
FOREIGN KEY ("contractListingId") REFERENCES "ContractListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "DriverPerformanceEntry"
ADD CONSTRAINT "DriverPerformanceEntry_recordedById_fkey"
FOREIGN KEY ("recordedById") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
