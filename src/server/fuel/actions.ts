"use server";

import { revalidatePath } from "next/cache";
import { createFuelEntry, updateFuelEntry } from "./service";
import { fuelEntrySchema } from "./validation";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "@/src/server/platform/audit";
import { notify } from "@/src/server/platform/notifications";

export interface FuelActionState {
  success: boolean;
  message: string;
  entryId?: string;
  fieldErrors?: Record<string, string[]>;
}

const text = (value: FormDataEntryValue | null) => typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => {
  const raw = text(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

function parse(formData: FormData) {
  const purchasedAt = text(formData.get("purchasedAt"));
  return fuelEntrySchema.safeParse({
    truckId: text(formData.get("truckId")) ?? "",
    fuelType: text(formData.get("fuelType")),
    quantity: number(formData.get("quantity")),
    unitPrice: number(formData.get("unitPrice")),
    odometerKm: number(formData.get("odometerKm")),
    fuelLevelAfter: number(formData.get("fuelLevelAfter")),
    station: text(formData.get("station")) ?? "",
    location: text(formData.get("location")),
    receiptNumber: text(formData.get("receiptNumber")),
    purchasedAt: purchasedAt ? new Date(purchasedAt) : new Date("invalid"),
    notes: text(formData.get("notes")),
  });
}

async function run(formData: FormData, id?: string): Promise<FuelActionState> {
  await authorize("fuel:manage");
  const result = parse(formData);
  if (!result.success) return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  try {
    const entry = id ? await updateFuelEntry(id, result.data) : await createFuelEntry(result.data);
    await Promise.all([
      recordAudit({ action: id ? "UPDATE" : "CREATE", entityType: "FuelEntry", entityId: entry.id, summary: `${id ? "Updated" : "Recorded"} fuel entry ${entry.reference}`, after: entry }),
      notify({ title: id ? "Fuel entry updated" : "Fuel entry recorded", message: `${entry.reference} · ${entry.truck.fleetNumber}`, type: "FUEL", severity: "INFO", entityType: "FuelEntry", entityId: entry.id, entityHref: `/dashboard/fuel/${entry.id}` }),
    ]);
    revalidatePath("/dashboard/fuel");
    revalidatePath("/dashboard/fleet");
    revalidatePath(`/dashboard/fleet/${entry.truckId}`);
    if ("previousTruckId" in entry && entry.previousTruckId !== entry.truckId) {
      revalidatePath(`/dashboard/fleet/${entry.previousTruckId}`);
    }
    return { success: true, message: id ? "Fuel entry updated." : "Fuel entry recorded.", entryId: entry.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to save the fuel entry." };
  }
}

export async function createFuelEntryAction(_state: FuelActionState, formData: FormData) { return run(formData); }
export async function updateFuelEntryAction(id: string, _state: FuelActionState, formData: FormData) { return run(formData, id); }
