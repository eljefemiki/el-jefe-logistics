CREATE TYPE "TransportJobStatus" AS ENUM ('STARTED', 'COMPLETED', 'CANCELLED', 'DELETED');
CREATE TYPE "VehicleIssueKind" AS ENUM ('WEAR', 'DAMAGE', 'SERVICE');
CREATE TYPE "VehicleIssueStatus" AS ENUM ('OPEN', 'SCHEDULED', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED');

ALTER TABLE "Driver"
  ADD COLUMN "truckyUserId" TEXT,
  ADD COLUMN "steamId" TEXT,
  ADD COLUMN "truckyUsername" TEXT,
  ADD COLUMN "lastTruckySyncAt" TIMESTAMP(3);
ALTER TABLE "Truck" ADD COLUMN "truckyVehicleId" TEXT;
ALTER TABLE "Invoice" ADD COLUMN "transportJobId" TEXT;

CREATE TABLE "TransportJob" (
  "id" TEXT NOT NULL,
  "truckyJobId" TEXT NOT NULL,
  "status" "TransportJobStatus" NOT NULL DEFAULT 'STARTED',
  "game" TEXT,
  "driverId" TEXT,
  "truckId" TEXT,
  "sourceCity" TEXT,
  "sourceCompany" TEXT,
  "destinationCity" TEXT,
  "destinationCompany" TEXT,
  "cargo" TEXT,
  "cargoMassKg" DOUBLE PRECISION,
  "distanceKm" INTEGER,
  "drivenDistanceKm" INTEGER,
  "startedAt" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "cancelledAt" TIMESTAMP(3),
  "revenue" DOUBLE PRECISION,
  "fuelCost" DOUBLE PRECISION,
  "tollCost" DOUBLE PRECISION,
  "ferryCost" DOUBLE PRECISION,
  "damageCost" DOUBLE PRECISION,
  "otherCosts" DOUBLE PRECISION,
  "profit" DOUBLE PRECISION,
  "currency" TEXT NOT NULL DEFAULT 'EUR',
  "damagePercent" DOUBLE PRECISION,
  "truckWearPercent" DOUBLE PRECISION,
  "trailerWearPercent" DOUBLE PRECISION,
  "fuelUsedLitres" DOUBLE PRECISION,
  "averageFuelConsumption" DOUBLE PRECISION,
  "rawPayload" JSONB NOT NULL,
  "lastEventAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TransportJob_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VehicleIssue" (
  "id" TEXT NOT NULL,
  "externalKey" TEXT,
  "truckId" TEXT NOT NULL,
  "transportJobId" TEXT,
  "kind" "VehicleIssueKind" NOT NULL,
  "status" "VehicleIssueStatus" NOT NULL DEFAULT 'OPEN',
  "component" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "severity" INTEGER NOT NULL DEFAULT 1,
  "wearPercent" DOUBLE PRECISION,
  "damagePercent" DOUBLE PRECISION,
  "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "scheduledFor" TIMESTAMP(3),
  "resolvedAt" TIMESTAMP(3),
  "rawPayload" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VehicleIssue_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TruckyEvent" (
  "id" TEXT NOT NULL,
  "fingerprint" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "externalId" TEXT,
  "payload" JSONB NOT NULL,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "error" TEXT,
  CONSTRAINT "TruckyEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TruckySyncState" (
  "id" TEXT NOT NULL DEFAULT 'company',
  "lastStartedAt" TIMESTAMP(3),
  "lastCompletedAt" TIMESTAMP(3),
  "lastSuccessfulAt" TIMESTAMP(3),
  "cursor" TEXT,
  "imported" INTEGER NOT NULL DEFAULT 0,
  "failed" INTEGER NOT NULL DEFAULT 0,
  "lastError" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TruckySyncState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Driver_truckyUserId_key" ON "Driver"("truckyUserId");
CREATE UNIQUE INDEX "Driver_steamId_key" ON "Driver"("steamId");
CREATE UNIQUE INDEX "Truck_truckyVehicleId_key" ON "Truck"("truckyVehicleId");
CREATE UNIQUE INDEX "Invoice_transportJobId_key" ON "Invoice"("transportJobId");
CREATE UNIQUE INDEX "TransportJob_truckyJobId_key" ON "TransportJob"("truckyJobId");
CREATE INDEX "TransportJob_driverId_completedAt_idx" ON "TransportJob"("driverId", "completedAt");
CREATE INDEX "TransportJob_truckId_completedAt_idx" ON "TransportJob"("truckId", "completedAt");
CREATE INDEX "TransportJob_status_completedAt_idx" ON "TransportJob"("status", "completedAt");
CREATE UNIQUE INDEX "VehicleIssue_externalKey_key" ON "VehicleIssue"("externalKey");
CREATE INDEX "VehicleIssue_truckId_status_idx" ON "VehicleIssue"("truckId", "status");
CREATE INDEX "VehicleIssue_kind_status_idx" ON "VehicleIssue"("kind", "status");
CREATE INDEX "VehicleIssue_scheduledFor_idx" ON "VehicleIssue"("scheduledFor");
CREATE UNIQUE INDEX "TruckyEvent_fingerprint_key" ON "TruckyEvent"("fingerprint");
CREATE INDEX "TruckyEvent_eventType_receivedAt_idx" ON "TruckyEvent"("eventType", "receivedAt");
CREATE INDEX "TruckyEvent_externalId_idx" ON "TruckyEvent"("externalId");

ALTER TABLE "TransportJob" ADD CONSTRAINT "TransportJob_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TransportJob" ADD CONSTRAINT "TransportJob_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VehicleIssue" ADD CONSTRAINT "VehicleIssue_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VehicleIssue" ADD CONSTRAINT "VehicleIssue_transportJobId_fkey" FOREIGN KEY ("transportJobId") REFERENCES "TransportJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_transportJobId_fkey" FOREIGN KEY ("transportJobId") REFERENCES "TransportJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
