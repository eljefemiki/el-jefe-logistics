"use server";
import { revalidatePath } from "next/cache";
import { createInvoice, updateInvoice } from "./service";
import { invoiceSchema } from "./validation";
export interface InvoiceActionState { success: boolean; message: string; invoiceId?: string; fieldErrors?: Record<string, string[]>; }
const text = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => Number(text(value) ?? 0);
async function save(formData: FormData, id?: string): Promise<InvoiceActionState> {
  const result = invoiceSchema.safeParse({ customerId: text(formData.get("customerId")), status: text(formData.get("status")),
    description: text(formData.get("description")), issueDate: text(formData.get("issueDate")), dueDate: text(formData.get("dueDate")),
    subtotal: number(formData.get("subtotal")), vatRate: number(formData.get("vatRate")), amountPaid: number(formData.get("amountPaid")),
    paidAt: text(formData.get("paidAt")), reference: text(formData.get("reference")), notes: text(formData.get("notes")) });
  if (!result.success) return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  try { const invoice = id ? await updateInvoice(id, result.data) : await createInvoice(result.data); revalidatePath("/dashboard/finance"); revalidatePath(`/dashboard/finance/${invoice.id}`); return { success: true, message: id ? "Invoice updated." : "Invoice created.", invoiceId: invoice.id }; }
  catch (error) { return { success: false, message: error instanceof Error ? error.message : "Unable to save invoice." }; }
}
export async function createInvoiceAction(_state: InvoiceActionState, formData: FormData) { return save(formData); }
export async function updateInvoiceAction(id: string, _state: InvoiceActionState, formData: FormData) { return save(formData, id); }
