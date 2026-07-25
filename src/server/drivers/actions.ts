"use server";

import { revalidatePath } from "next/cache";

import {
  archiveDriver,
  restoreDriver,
  updateDriver,
} from "./service";
import { updateDriverSchema } from "./validation";
import { authorize } from "@/src/lib/auth";

export interface UpdateDriverActionState {
  success: boolean;
  message: string;
  driverId?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

function optionalString(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function optionalNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function optionalDate(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function updateDriverAction(
  id: string,
  _previousState: UpdateDriverActionState,
  formData: FormData,
): Promise<UpdateDriverActionState> {
  await authorize("drivers:manage");
  const rawData = {
    firstName:
      optionalString(formData.get("firstName")) ?? "",
    lastName:
      optionalString(formData.get("lastName")) ?? "",
    email:
      optionalString(formData.get("email")) ?? "",
    employeeNumber:
      optionalString(formData.get("employeeNumber")) ?? "",
    callsign:
      optionalString(formData.get("callsign")),
    rank:
      optionalString(formData.get("rank")) ?? "TRAINEE",
    status:
      optionalString(formData.get("status")) ?? "AVAILABLE",
    reputation:
      optionalNumber(formData.get("reputation")) ?? 100,
    totalDistanceKm:
      optionalNumber(formData.get("totalDistanceKm")) ?? 0,
    totalDeliveries:
      optionalNumber(formData.get("totalDeliveries")) ?? 0,
    totalConvoys:
      optionalNumber(formData.get("totalConvoys")) ?? 0,
    favouriteTruck:
      optionalString(formData.get("favouriteTruck")),
    assignedTrailer:
      optionalString(formData.get("assignedTrailer")) ?? null,
    joinedAt:
      optionalDate(formData.get("joinedAt")),
    notes:
      optionalString(formData.get("notes")),
    isActive:
      formData.get("isActive") === "on",
  };

  const validationResult = updateDriverSchema.safeParse(rawData);

  if (!validationResult.success) {
    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors:
        validationResult.error.flatten().fieldErrors,
    };
  }

  try {
    const driver = await updateDriver(
      id,
      validationResult.data,
    );

    revalidatePath("/dashboard/drivers");
    revalidatePath(`/dashboard/drivers/${id}`);
    revalidatePath(`/dashboard/drivers/${id}/edit`);

    return {
      success: true,
      message: "Driver updated successfully.",
      driverId: driver.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the driver.",
    };
  }
}

export async function archiveDriverAction(
  id: string,
) {
  await authorize("drivers:manage");
  try {
    const driver = await archiveDriver(id);

    revalidatePath("/dashboard/drivers");
    revalidatePath(`/dashboard/drivers/${id}`);

    return {
      success: true,
      message: "Driver archived successfully.",
      driverId: driver.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to archive the driver.",
    };
  }
}

export async function restoreDriverAction(
  id: string,
) {
  await authorize("drivers:manage");
  try {
    const driver = await restoreDriver(id);

    revalidatePath("/dashboard/drivers");
    revalidatePath(`/dashboard/drivers/${id}`);

    return {
      success: true,
      message: "Driver restored successfully.",
      driverId: driver.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to restore the driver.",
    };
  }
}
