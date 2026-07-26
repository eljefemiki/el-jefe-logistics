ALTER TABLE "Truck" ADD COLUMN "archivedAt" TIMESTAMP(3);
CREATE INDEX "Truck_archivedAt_idx" ON "Truck"("archivedAt");
