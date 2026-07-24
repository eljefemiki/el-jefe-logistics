-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CEO', 'MANAGER', 'HR', 'DISPATCHER', 'FLEET_MANAGER', 'DRIVER', 'APPLICANT');

-- CreateEnum
CREATE TYPE "DriverRank" AS ENUM ('TRAINEE', 'JUNIOR', 'SENIOR', 'ELITE');

-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('AVAILABLE', 'DRIVING', 'OFF_DUTY', 'ON_LEAVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "TruckStatus" AS ENUM ('AVAILABLE', 'DELIVERING', 'MAINTENANCE', 'OUT_OF_SERVICE');

-- CreateEnum
CREATE TYPE "TruckManufacturer" AS ENUM ('VOLVO', 'SCANIA', 'DAF', 'MAN', 'MERCEDES', 'RENAULT', 'IVECO');

-- CreateEnum
CREATE TYPE "TruckType" AS ENUM ('TRACTOR', 'RIGID');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'DRIVER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "employeeNumber" TEXT NOT NULL,
    "callsign" TEXT,
    "rank" "DriverRank" NOT NULL DEFAULT 'TRAINEE',
    "status" "DriverStatus" NOT NULL DEFAULT 'AVAILABLE',
    "reputation" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "totalDistanceKm" INTEGER NOT NULL DEFAULT 0,
    "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
    "totalConvoys" INTEGER NOT NULL DEFAULT 0,
    "favouriteTruck" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "headquarters" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Depot" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Depot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Truck" (
    "id" TEXT NOT NULL,
    "fleetNumber" TEXT NOT NULL,
    "registration" TEXT NOT NULL,
    "manufacturer" "TruckManufacturer" NOT NULL,
    "model" TEXT NOT NULL,
    "type" "TruckType" NOT NULL DEFAULT 'TRACTOR',
    "year" INTEGER NOT NULL,
    "colour" TEXT,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "fuelLevel" INTEGER NOT NULL DEFAULT 100,
    "status" "TruckStatus" NOT NULL DEFAULT 'AVAILABLE',
    "depotId" TEXT,
    "driverId" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "purchasePrice" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Truck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_email_idx" ON "Account"("email");

-- CreateIndex
CREATE INDEX "Account_role_idx" ON "Account"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_accountId_key" ON "Driver"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_employeeNumber_key" ON "Driver"("employeeNumber");

-- CreateIndex
CREATE INDEX "Driver_employeeNumber_idx" ON "Driver"("employeeNumber");

-- CreateIndex
CREATE INDEX "Driver_status_idx" ON "Driver"("status");

-- CreateIndex
CREATE INDEX "Driver_rank_idx" ON "Driver"("rank");

-- CreateIndex
CREATE UNIQUE INDEX "Company_code_key" ON "Company"("code");

-- CreateIndex
CREATE INDEX "Company_code_idx" ON "Company"("code");

-- CreateIndex
CREATE INDEX "Depot_companyId_idx" ON "Depot"("companyId");

-- CreateIndex
CREATE INDEX "Depot_name_idx" ON "Depot"("name");

-- CreateIndex
CREATE INDEX "Depot_city_idx" ON "Depot"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_fleetNumber_key" ON "Truck"("fleetNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Truck_registration_key" ON "Truck"("registration");

-- CreateIndex
CREATE INDEX "Truck_fleetNumber_idx" ON "Truck"("fleetNumber");

-- CreateIndex
CREATE INDEX "Truck_registration_idx" ON "Truck"("registration");

-- CreateIndex
CREATE INDEX "Truck_status_idx" ON "Truck"("status");

-- CreateIndex
CREATE INDEX "Truck_manufacturer_idx" ON "Truck"("manufacturer");

-- CreateIndex
CREATE INDEX "Truck_depotId_idx" ON "Truck"("depotId");

-- CreateIndex
CREATE INDEX "Truck_driverId_idx" ON "Truck"("driverId");

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depot" ADD CONSTRAINT "Depot_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_depotId_fkey" FOREIGN KEY ("depotId") REFERENCES "Depot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Truck" ADD CONSTRAINT "Truck_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
