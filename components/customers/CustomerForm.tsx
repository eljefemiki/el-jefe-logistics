"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Save } from "lucide-react";
import { createCustomerAction, type CustomerActionState, updateCustomerAction } from "@/src/server/customers/actions";

type Customer = NonNullable<Awaited<ReturnType<typeof import("@/src/server/customers/service").getCustomer>>>;
const initial: CustomerActionState = { success: false, message: "" };
const input = "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const label = "mb-2 block text-sm font-medium text-slate-300";

function Field({ name, title, error, children }: { name: string; title: string; error?: string[]; children: React.ReactNode }) {
  return <div><label htmlFor={name} className={label}>{title}</label>{children}{error?.[0] && <p className="mt-2 text-sm text-red-400">{error[0]}</p>}</div>;
}

export default function CustomerForm({ customer }: { customer?: Customer }) {
  const router = useRouter();
  const action = customer ? updateCustomerAction.bind(null, customer.id) : createCustomerAction;
  const [state, formAction, pending] = useActionState(action, initial);
  useEffect(() => { if (state.success && state.customerId) { router.push(`/dashboard/customers/${state.customerId}`); router.refresh(); } }, [state, router]);
  return <form action={formAction} className="space-y-6">
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Account details</h2><p className="mt-1 text-sm text-slate-400">Customer identity, lifecycle status and commercial terms.</p><div className="mt-6 grid gap-6 md:grid-cols-2">
      <Field name="companyName" title="Company name" error={state.fieldErrors?.companyName}><input id="companyName" name="companyName" defaultValue={customer?.companyName} required className={input} /></Field>
      <Field name="status" title="Account status" error={state.fieldErrors?.status}><select id="status" name="status" defaultValue={customer?.status ?? "LEAD"} className={input}><option value="LEAD">Lead</option><option value="ACTIVE">Active</option><option value="ON_HOLD">On hold</option><option value="INACTIVE">Inactive</option></select></Field>
      <Field name="creditLimit" title="Credit limit (£)" error={state.fieldErrors?.creditLimit}><input id="creditLimit" name="creditLimit" type="number" min="0" step="0.01" defaultValue={customer?.creditLimit ?? undefined} className={input} /></Field>
      <Field name="paymentTermsDays" title="Payment terms (days)" error={state.fieldErrors?.paymentTermsDays}><input id="paymentTermsDays" name="paymentTermsDays" type="number" min="0" max="365" defaultValue={customer?.paymentTermsDays ?? 30} required className={input} /></Field>
    </div></section>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Primary contact</h2><div className="mt-6 grid gap-6 md:grid-cols-2">
      <Field name="contactFirstName" title="First name" error={state.fieldErrors?.contactFirstName}><input id="contactFirstName" name="contactFirstName" defaultValue={customer?.contactFirstName} required className={input} /></Field>
      <Field name="contactLastName" title="Last name" error={state.fieldErrors?.contactLastName}><input id="contactLastName" name="contactLastName" defaultValue={customer?.contactLastName} required className={input} /></Field>
      <Field name="email" title="Contact email" error={state.fieldErrors?.email}><input id="email" name="email" type="email" defaultValue={customer?.email} required className={input} /></Field>
      <Field name="phone" title="Phone" error={state.fieldErrors?.phone}><input id="phone" name="phone" type="tel" defaultValue={customer?.phone ?? ""} className={input} /></Field>
      <Field name="billingEmail" title="Billing email" error={state.fieldErrors?.billingEmail}><input id="billingEmail" name="billingEmail" type="email" defaultValue={customer?.billingEmail ?? ""} className={input} /></Field>
    </div></section>
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-6"><h2 className="text-lg font-semibold text-white">Address & notes</h2><div className="mt-6 grid gap-6 md:grid-cols-2">
      <Field name="addressLine1" title="Address line 1" error={state.fieldErrors?.addressLine1}><input id="addressLine1" name="addressLine1" defaultValue={customer?.addressLine1 ?? ""} className={input} /></Field>
      <Field name="addressLine2" title="Address line 2" error={state.fieldErrors?.addressLine2}><input id="addressLine2" name="addressLine2" defaultValue={customer?.addressLine2 ?? ""} className={input} /></Field>
      <Field name="city" title="City" error={state.fieldErrors?.city}><input id="city" name="city" defaultValue={customer?.city ?? ""} className={input} /></Field>
      <Field name="postcode" title="Postcode" error={state.fieldErrors?.postcode}><input id="postcode" name="postcode" defaultValue={customer?.postcode ?? ""} className={input} /></Field>
      <Field name="country" title="Country" error={state.fieldErrors?.country}><input id="country" name="country" defaultValue={customer?.country ?? "United Kingdom"} required className={input} /></Field>
    </div><div className="mt-6"><Field name="notes" title="Relationship notes" error={state.fieldErrors?.notes}><textarea id="notes" name="notes" rows={5} defaultValue={customer?.notes ?? ""} className={input} /></Field></div></section>
    {state.message && !state.success && <div className="flex gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300"><AlertCircle className="h-5 w-5" /><p className="text-sm">{state.message}</p></div>}
    <div className="flex justify-end gap-3"><Link href={customer ? `/dashboard/customers/${customer.id}` : "/dashboard/customers"} className="rounded-lg border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800">Cancel</Link><button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{customer ? "Update customer" : "Create customer"}</button></div>
  </form>;
}
