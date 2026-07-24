CREATE TYPE "CustomerStatus" AS ENUM ('LEAD', 'ACTIVE', 'ON_HOLD', 'INACTIVE');

CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "status" "CustomerStatus" NOT NULL DEFAULT 'LEAD',
    "contactFirstName" TEXT NOT NULL,
    "contactLastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "billingEmail" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'United Kingdom',
    "creditLimit" DOUBLE PRECISION,
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 30,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Customer_customerNumber_key" ON "Customer"("customerNumber");
CREATE INDEX "Customer_customerNumber_idx" ON "Customer"("customerNumber");
CREATE INDEX "Customer_companyName_idx" ON "Customer"("companyName");
CREATE INDEX "Customer_status_idx" ON "Customer"("status");
CREATE INDEX "Customer_email_idx" ON "Customer"("email");
CREATE INDEX "Customer_archivedAt_idx" ON "Customer"("archivedAt");
