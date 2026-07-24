"use server";

import { revalidatePath } from "next/cache";
import { archiveCustomer, createCustomer, restoreCustomer, updateCustomer } from "./service";
import { customerSchema } from "./validation";

export interface CustomerActionState {
  success: boolean;
  message: string;
  customerId?: string;
  fieldErrors?: Record<string, string[]>;
}

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => {
  const raw = text(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function parse(formData: FormData) {
  return customerSchema.safeParse({
    companyName: text(formData.get("companyName")) ?? "",
    status: text(formData.get("status")),
    contactFirstName: text(formData.get("contactFirstName")) ?? "",
    contactLastName: text(formData.get("contactLastName")) ?? "",
    email: text(formData.get("email")) ?? "",
    phone: text(formData.get("phone")),
    billingEmail: text(formData.get("billingEmail")) ?? "",
    addressLine1: text(formData.get("addressLine1")),
    addressLine2: text(formData.get("addressLine2")),
    city: text(formData.get("city")),
    postcode: text(formData.get("postcode")),
    country: text(formData.get("country")) ?? "",
    creditLimit: number(formData.get("creditLimit")),
    paymentTermsDays: number(formData.get("paymentTermsDays")),
    notes: text(formData.get("notes")),
  });
}

async function save(formData: FormData, id?: string): Promise<CustomerActionState> {
  const result = parse(formData);
  if (!result.success) {
    return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const customer = id ? await updateCustomer(id, result.data) : await createCustomer(result.data);
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/dispatch");
    return { success: true, message: id ? "Customer updated." : "Customer created.", customerId: customer.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to save the customer." };
  }
}

export async function createCustomerAction(_state: CustomerActionState, formData: FormData) {
  return save(formData);
}

export async function updateCustomerAction(id: string, _state: CustomerActionState, formData: FormData) {
  return save(formData, id);
}

export async function archiveCustomerAction(id: string) {
  await archiveCustomer(id);
  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
}

export async function restoreCustomerAction(id: string) {
  await restoreCustomer(id);
  revalidatePath("/dashboard/customers");
  revalidatePath(`/dashboard/customers/${id}`);
}
