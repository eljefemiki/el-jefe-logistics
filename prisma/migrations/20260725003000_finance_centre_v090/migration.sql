CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PART_PAID', 'PAID', 'OVERDUE', 'VOID');
CREATE TABLE "Invoice" (
  "id" TEXT NOT NULL, "invoiceNumber" TEXT NOT NULL, "customerId" TEXT NOT NULL,
  "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT', "description" TEXT NOT NULL,
  "issueDate" TIMESTAMP(3) NOT NULL, "dueDate" TIMESTAMP(3) NOT NULL,
  "subtotal" DOUBLE PRECISION NOT NULL, "vatRate" DOUBLE PRECISION NOT NULL DEFAULT 20,
  "vatAmount" DOUBLE PRECISION NOT NULL, "total" DOUBLE PRECISION NOT NULL,
  "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0, "paidAt" TIMESTAMP(3),
  "reference" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE INDEX "Invoice_customerId_idx" ON "Invoice"("customerId");
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX "Invoice_issueDate_idx" ON "Invoice"("issueDate");
CREATE INDEX "Invoice_dueDate_idx" ON "Invoice"("dueDate");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
