"use server";

import { revalidatePath } from "next/cache";

import { authorize } from "@/src/lib/auth";
import { recordDriverPerformanceEntry } from "./repository";
import { driverPerformanceEntrySchema } from "./validation";

export interface DriverPerformanceActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function number(value: FormDataEntryValue | null) {
  const raw = text(value);
  return raw === undefined ? undefined : Number(raw);
}

export async function createDriverPerformanceEntryAction(
  _previousState: DriverPerformanceActionState,
  formData: FormData,
): Promise<DriverPerformanceActionState> {
  const actor = await authorize("drivers:manage");
  const completedAtText = text(formData.get("completedAt"));
  const validation = driverPerformanceEntrySchema.safeParse({
    driverId: text(formData.get("driverId")),
    customerId: text(formData.get("customerId")),
    contractListingId: text(formData.get("contractListingId")),
    distanceKm: number(formData.get("distanceKm")),
    cargoTonnes: number(formData.get("cargoTonnes")),
    income: number(formData.get("income")),
    expenditure: number(formData.get("expenditure")),
    reputationScore: number(formData.get("reputationScore")),
    completedAt: completedAtText
      ? new Date(`${completedAtText}T12:00:00Z`)
      : undefined,
    notes: text(formData.get("notes")),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Please check the completed delivery details.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await recordDriverPerformanceEntry(actor.id, validation.data);

    revalidatePath("/profile");
    revalidatePath(`/dashboard/drivers/${validation.data.driverId}`);
    revalidatePath("/dashboard/drivers");
    return { success: true, message: "Completed delivery recorded." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "The completed delivery could not be recorded.",
    };
  }
}
