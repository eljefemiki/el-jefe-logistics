"use client";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { createInvoiceAction, type InvoiceActionState, updateInvoiceAction } from "@/src/server/finance/actions";
type Invoice = NonNullable<Awaited<ReturnType<typeof import("@/src/server/finance/service").getInvoice>>>;
type Customer = Awaited<ReturnType<typeof import("@/src/server/finance/service").getInvoiceCustomers>>[number];
const initial: InvoiceActionState = { success: false, message: "" };
const input = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const today = () => new Date().toISOString().slice(0, 10);
const dateValue = (value?: Date | null) => value ? new Date(value).toISOString().slice(0, 10) : "";
function Field({ name, title, error, children }: { name: string; title: string; error?: string[]; children: React.ReactNode }) { return <div><label htmlFor={name} className="mb-2 block text-sm font-medium text-slate-300">{title}</label>{children}{error?.[0] && <p className="mt-2 text-sm text-red-400">{error[0]}</p>}</div>; }
export default function InvoiceForm({ customers, invoice }: { customers: Customer[]; invoice?: Invoice }) {
  const router = useRouter(); const action = invoice ? updateInvoiceAction.bind(null, invoice.id) : createInvoiceAction;
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => { if (state.success && state.invoiceId) { router.push(`/dashboard/finance/${state.invoiceId}`); router.refresh(); } }, [state, router]);
  return <form action={formAction} className="space-y-6"><section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Invoice details</h2><div className="mt-6 grid gap-6 md:grid-cols-2">
    <Field name="customerId" title="Customer" error={state.fieldErrors?.customerId}><select id="customerId" name="customerId" defaultValue={invoice?.customerId ?? ""} required className={input}><option value="">Select customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customerNumber} · {customer.companyName}</option>)}</select></Field>
    <Field name="status" title="Status" error={state.fieldErrors?.status}><select id="status" name="status" defaultValue={invoice?.status ?? "DRAFT"} className={input}><option value="DRAFT">Draft</option><option value="SENT">Sent</option><option value="PART_PAID">Part paid</option><option value="PAID">Paid</option><option value="OVERDUE">Overdue</option><option value="VOID">Void</option></select></Field>
    <div className="md:col-span-2"><Field name="description" title="Description" error={state.fieldErrors?.description}><input id="description" name="description" defaultValue={invoice?.description ?? ""} required className={input} placeholder="Transport services and delivery period" /></Field></div>
    <Field name="issueDate" title="Issue date" error={state.fieldErrors?.issueDate}><input id="issueDate" name="issueDate" type="date" defaultValue={dateValue(invoice?.issueDate) || today()} required className={input} /></Field>
    <Field name="dueDate" title="Due date" error={state.fieldErrors?.dueDate}><input id="dueDate" name="dueDate" type="date" defaultValue={dateValue(invoice?.dueDate)} required className={input} /></Field>
    <Field name="reference" title="Customer reference" error={state.fieldErrors?.reference}><input id="reference" name="reference" defaultValue={invoice?.reference ?? ""} className={input} /></Field>
  </div></section><section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Values & payment</h2><div className="mt-6 grid gap-6 md:grid-cols-2">
    <Field name="subtotal" title="Subtotal (£)" error={state.fieldErrors?.subtotal}><input id="subtotal" name="subtotal" type="number" min="0.01" step="0.01" defaultValue={invoice?.subtotal ?? ""} required className={input} /></Field>
    <Field name="vatRate" title="VAT rate (%)" error={state.fieldErrors?.vatRate}><input id="vatRate" name="vatRate" type="number" min="0" max="100" step="0.01" defaultValue={invoice?.vatRate ?? 20} required className={input} /></Field>
    <Field name="amountPaid" title="Amount paid (£)" error={state.fieldErrors?.amountPaid}><input id="amountPaid" name="amountPaid" type="number" min="0" step="0.01" defaultValue={invoice?.amountPaid ?? 0} className={input} /></Field>
    <Field name="paidAt" title="Payment date" error={state.fieldErrors?.paidAt}><input id="paidAt" name="paidAt" type="date" defaultValue={dateValue(invoice?.paidAt)} className={input} /></Field>
    <div className="md:col-span-2"><Field name="notes" title="Internal notes" error={state.fieldErrors?.notes}><textarea id="notes" name="notes" rows={4} defaultValue={invoice?.notes ?? ""} className={input} /></Field></div>
  </div></section>{state.message && !state.success && <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"><AlertCircle className="h-5 w-5" /><p className="text-sm">{state.message}</p></div>}
  <div className="flex justify-end gap-3"><Link href={invoice ? `/dashboard/finance/${invoice.id}` : "/dashboard/finance"} className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800">Cancel</Link><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{invoice ? "Update invoice" : "Create invoice"}</button></div></form>;
}
