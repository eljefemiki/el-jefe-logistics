"use server";
import { revalidatePath } from "next/cache";
import { createInvoice, getInvoice, updateInvoice } from "./service";
import { invoiceSchema } from "./validation";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "@/src/server/platform/audit";
import { notify } from "@/src/server/platform/notifications";
export interface InvoiceActionState { success: boolean; message: string; invoiceId?: string; fieldErrors?: Record<string, string[]>; }
const text = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => Number(text(value) ?? 0);
async function save(formData: FormData, id?: string): Promise<InvoiceActionState> {
  await authorize("finance:manage");
  const result = invoiceSchema.safeParse({ customerId: text(formData.get("customerId")), status: text(formData.get("status")),
    description: text(formData.get("description")), issueDate: text(formData.get("issueDate")), dueDate: text(formData.get("dueDate")),
    subtotal: number(formData.get("subtotal")), vatRate: number(formData.get("vatRate")), amountPaid: number(formData.get("amountPaid")),
    paidAt: text(formData.get("paidAt")), reference: text(formData.get("reference")), notes: text(formData.get("notes")) });
  if (!result.success) return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  try { const before = id ? await getInvoice(id) : null; const invoice = id ? await updateInvoice(id, result.data) : await createInvoice(result.data); await Promise.all([
    recordAudit({ action: id ? (invoice.amountPaid !== before?.amountPaid ? "PAYMENT" : "UPDATE") : "CREATE", entityType: "Invoice", entityId: invoice.id, summary: `${id ? "Updated" : "Created"} invoice ${invoice.invoiceNumber}`, before, after: invoice }),
    notify({ title: id ? "Invoice updated" : "Invoice created", message: invoice.invoiceNumber, type: "FINANCE", severity: "SUCCESS", entityType: "Invoice", entityId: invoice.id, entityHref: `/dashboard/finance/${invoice.id}` }),
  ]); revalidatePath("/dashboard/finance"); revalidatePath(`/dashboard/finance/${invoice.id}`); return { success: true, message: id ? "Invoice updated." : "Invoice created.", invoiceId: invoice.id }; }
  catch (error) { return { success: false, message: error instanceof Error ? error.message : "Unable to save invoice." }; }
}
export async function createInvoiceAction(_state: InvoiceActionState, formData: FormData) { return save(formData); }
export async function updateInvoiceAction(id: string, _state: InvoiceActionState, formData: FormData) { return save(formData, id); }
