CREATE TYPE "FuelType" AS ENUM ('DIESEL', 'HVO', 'ADBLUE', 'ELECTRIC', 'OTHER');

CREATE TABLE "FuelEntry" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "fuelType" "FuelType" NOT NULL DEFAULT 'DIESEL',
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalCost" DOUBLE PRECISION NOT NULL,
    "odometerKm" INTEGER NOT NULL,
    "fuelLevelAfter" INTEGER,
    "station" TEXT NOT NULL,
    "location" TEXT,
    "receiptNumber" TEXT,
    "purchasedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "FuelEntry_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "FuelEntry_reference_key" ON "FuelEntry"("reference");
CREATE INDEX "FuelEntry_truckId_idx" ON "FuelEntry"("truckId");
CREATE INDEX "FuelEntry_fuelType_idx" ON "FuelEntry"("fuelType");
CREATE INDEX "FuelEntry_purchasedAt_idx" ON "FuelEntry"("purchasedAt");
CREATE INDEX "FuelEntry_station_idx" ON "FuelEntry"("station");

ALTER TABLE "FuelEntry" ADD CONSTRAINT "FuelEntry_truckId_fkey"
FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
