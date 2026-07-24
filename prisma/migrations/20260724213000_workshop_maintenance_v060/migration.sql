-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('REPORTED', 'SCHEDULED', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'ROUTINE', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('INSPECTION', 'PREVENTIVE_SERVICE', 'REPAIR', 'TYRES', 'MOT', 'BREAKDOWN', 'OTHER');

-- CreateTable
CREATE TABLE "MaintenanceJob" (
    "id" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "truckId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "MaintenanceType" NOT NULL,
    "priority" "MaintenancePriority" NOT NULL DEFAULT 'ROUTINE',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'REPORTED',
    "odometerKm" INTEGER,
    "technician" TEXT,
    "vendor" TEXT,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledFor" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedCost" DOUBLE PRECISION,
    "actualCost" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceJob_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MaintenanceJob_jobNumber_key" ON "MaintenanceJob"("jobNumber");
CREATE INDEX "MaintenanceJob_truckId_idx" ON "MaintenanceJob"("truckId");
CREATE INDEX "MaintenanceJob_status_idx" ON "MaintenanceJob"("status");
CREATE INDEX "MaintenanceJob_priority_idx" ON "MaintenanceJob"("priority");
CREATE INDEX "MaintenanceJob_scheduledFor_idx" ON "MaintenanceJob"("scheduledFor");

ALTER TABLE "MaintenanceJob" ADD CONSTRAINT "MaintenanceJob_truckId_fkey" FOREIGN KEY ("truckId") REFERENCES "Truck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
