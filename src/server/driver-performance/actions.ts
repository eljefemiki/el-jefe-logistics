"use server";

import { revalidatePath } from "next/cache";

import { authorize } from "@/src/lib/auth";
import { recordDriverPerformanceEntry } from "./repository";
import { driverPerformanceEntrySchema } from "./validation";
import { recordAudit } from "@/src/server/platform/audit";
import { notify } from "@/src/server/platform/notifications";

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
    repairCosts: number(formData.get("repairCosts")) ?? 0,
    damageCosts: number(formData.get("damageCosts")) ?? 0,
    otherCosts: number(formData.get("otherCosts")) ?? 0,
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
    const result = await recordDriverPerformanceEntry(actor.id, validation.data);
    await Promise.all([
      recordAudit({
        action: "CREATE",
        entityType: "DriverPerformanceEntry",
        entityId: result.entry.id,
        summary: `Recorded completed delivery and created invoice ${result.invoice.invoiceNumber}`,
        after: { entry: result.entry, invoice: result.invoice },
      }),
      notify({
        title: "Journey invoice created",
        message: `${result.invoice.invoiceNumber} · £${result.invoice.total.toFixed(2)}`,
        type: "FINANCE",
        severity: "SUCCESS",
        entityType: "Invoice",
        entityId: result.invoice.id,
        entityHref: `/dashboard/finance/${result.invoice.id}`,
      }),
    ]);

    revalidatePath("/profile");
    revalidatePath(`/dashboard/drivers/${validation.data.driverId}`);
    revalidatePath("/dashboard/drivers");
    revalidatePath("/dashboard/finance");
    revalidatePath(`/dashboard/finance/${result.invoice.id}`);
    revalidatePath("/dashboard/marketplace");
    return {
      success: true,
      message: `Completed delivery recorded and draft invoice ${result.invoice.invoiceNumber} created.`,
    };
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
