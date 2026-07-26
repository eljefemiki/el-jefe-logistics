ALTER TABLE "DriverPerformanceEntry"
  ADD COLUMN "repairCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "damageCosts" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN "otherCosts" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "DriverPerformanceEntry"
SET "otherCosts" = "expenditure";

ALTER TABLE "Invoice"
  ADD COLUMN "driverPerformanceEntryId" TEXT;

CREATE UNIQUE INDEX "Invoice_driverPerformanceEntryId_key"
  ON "Invoice"("driverPerformanceEntryId");
CREATE INDEX "Invoice_driverPerformanceEntryId_idx"
  ON "Invoice"("driverPerformanceEntryId");

ALTER TABLE "Invoice"
  ADD CONSTRAINT "Invoice_driverPerformanceEntryId_fkey"
  FOREIGN KEY ("driverPerformanceEntryId")
  REFERENCES "DriverPerformanceEntry"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;
