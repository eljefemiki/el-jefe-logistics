import Link from "next/link";
import { notFound } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import InvoiceForm from "@/components/finance/InvoiceForm";
import { getInvoice, getInvoiceCustomers } from "@/src/server/finance/service";
export const dynamic = "force-dynamic";
export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; const [invoice, customers] = await Promise.all([getInvoice(id), getInvoiceCustomers()]); if (!invoice) notFound();
  return <DashboardLayout title={`Edit ${invoice.invoiceNumber}`} subtitle="Update invoice and payment status."><div className="mx-auto max-w-4xl space-y-8"><div><Link href={`/dashboard/finance/${invoice.id}`} className="text-sm text-violet-400 hover:text-violet-300">← {invoice.invoiceNumber}</Link><h1 className="mt-2 text-3xl font-bold text-white">Edit invoice</h1></div><InvoiceForm customers={customers} invoice={invoice} /></div></DashboardLayout>;
}
