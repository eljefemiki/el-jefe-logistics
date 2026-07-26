-- Add lease financing information while preserving existing fleet records as owned.
CREATE TYPE "TruckOwnershipType" AS ENUM ('OWNED', 'LEASED');

ALTER TABLE "Truck"
ADD COLUMN "ownershipType" "TruckOwnershipType" NOT NULL DEFAULT 'OWNED',
ADD COLUMN "leaseStartDate" TIMESTAMP(3),
ADD COLUMN "leaseTermMonths" INTEGER;

ALTER TABLE "Truck"
ADD CONSTRAINT "Truck_leaseTermMonths_check"
CHECK ("leaseTermMonths" IS NULL OR "leaseTermMonths" IN (24, 36, 48));

ALTER TABLE "Truck"
ADD CONSTRAINT "Truck_leaseFinancing_check"
CHECK (
  "ownershipType" = 'OWNED'
  OR (
    "purchasePrice" > 0
    AND "leaseStartDate" IS NOT NULL
    AND "leaseTermMonths" IN (24, 36, 48)
  )
);
