import Link from "next/link";
import { ReceiptText } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
type Invoice = Awaited<ReturnType<typeof import("@/src/server/finance/service").getFinanceCentre>>["invoices"][number];
const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });
const date = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" });
export default function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  if (!invoices.length) return <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center"><ReceiptText className="mx-auto h-10 w-10 text-slate-600" /><h2 className="mt-4 font-semibold text-white">No invoices found</h2><p className="mt-2 text-sm text-slate-400">Create an invoice or adjust the current filters.</p></div>;
  return <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900"><table className="w-full text-left text-sm"><thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Invoice</th><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Due</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Total</th><th className="px-5 py-4 text-right">Balance</th></tr></thead><tbody className="divide-y divide-slate-800">{invoices.map((invoice) => {
    const overdue = invoice.dueDate < new Date() && !["PAID", "VOID"].includes(invoice.status); return <tr key={invoice.id} className="hover:bg-slate-800/50"><td className="px-5 py-4"><Link href={`/dashboard/finance/${invoice.id}`} className="font-semibold text-violet-300 hover:text-violet-200">{invoice.invoiceNumber}</Link><p className="mt-1 max-w-xs truncate text-slate-500">{invoice.description}</p></td><td className="px-5 py-4 text-slate-300">{invoice.customer.companyName}</td><td className="px-5 py-4 text-slate-400">{date.format(invoice.dueDate)}</td><td className="px-5 py-4"><InvoiceStatusBadge status={invoice.status} overdue={overdue} /></td><td className="px-5 py-4 text-right font-medium text-white">{money.format(invoice.total)}</td><td className="px-5 py-4 text-right text-slate-300">{money.format(Math.max(0, invoice.total - invoice.amountPaid))}</td></tr>;
  })}</tbody></table></div>;
}
