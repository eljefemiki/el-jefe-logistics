"use server";

import { revalidatePath } from "next/cache";

import {
  createTruck,
  removeTruck,
  updateTruck,
  archiveTruck,
  getTruck,
} from "./service";
import {
  createTruckSchema,
  updateTruckSchema,
} from "./validation";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "@/src/server/platform/audit";

export interface CreateTruckActionState {
  success: boolean;
  message: string;
  truckId?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export type UpdateTruckActionState = CreateTruckActionState;

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

export async function createTruckAction(
  _previousState: CreateTruckActionState,
  formData: FormData
): Promise<CreateTruckActionState> {
  await authorize("fleet:manage");
  const rawData = {
    fleetNumber:
      optionalString(formData.get("fleetNumber")) ?? "",

    registration:
      optionalString(formData.get("registration")) ?? "",

    manufacturer:
      optionalString(formData.get("manufacturer")),

    model:
      optionalString(formData.get("model")) ?? "",

    type:
      optionalString(formData.get("type")) ?? "TRACTOR",

    year:
      optionalNumber(formData.get("year")),

    colour:
      optionalString(formData.get("colour")),

    mileage:
      optionalNumber(formData.get("mileage")) ?? 0,

    fuelLevel:
      optionalNumber(formData.get("fuelLevel")) ?? 100,

    status:
      optionalString(formData.get("status")) ?? "AVAILABLE",

    depotId:
      optionalString(formData.get("depotId")),

    driverId:
      optionalString(formData.get("driverId")),

    purchaseDate:
      optionalDate(formData.get("purchaseDate")),

    purchasePrice:
      optionalNumber(formData.get("purchasePrice")),

    currentValue:
      optionalNumber(formData.get("currentValue")),

    ownershipType:
      optionalString(formData.get("ownershipType")) ?? "OWNED",

    leaseStartDate:
      optionalDate(formData.get("leaseStartDate")),

    leaseTermMonths:
      optionalNumber(formData.get("leaseTermMonths")),
  };

  const validationResult = createTruckSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors =
      validationResult.error.flatten().fieldErrors;

    console.error("Truck validation failed:", fieldErrors);

    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    const truck = await createTruck(validationResult.data);
    await recordAudit({ action: "CREATE", entityType: "Truck", entityId: truck.id, summary: `Created truck ${truck.fleetNumber}`, after: truck });

    revalidatePath("/dashboard/fleet");

    return {
      success: true,
      message: "Truck created successfully.",
      truckId: truck.id,
    };
  } catch (error) {
    console.error("Failed to create truck:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to create the truck.",
    };
  }
}

export async function updateTruckAction(
  id: string,
  _previousState: UpdateTruckActionState,
  formData: FormData
): Promise<UpdateTruckActionState> {
  await authorize("fleet:manage");
  const rawData = {
    fleetNumber:
      optionalString(formData.get("fleetNumber")) ?? "",

    registration:
      optionalString(formData.get("registration")) ?? "",

    manufacturer:
      optionalString(formData.get("manufacturer")),

    model:
      optionalString(formData.get("model")) ?? "",

    type:
      optionalString(formData.get("type")) ?? "TRACTOR",

    year:
      optionalNumber(formData.get("year")),

    colour:
      optionalString(formData.get("colour")),

    mileage:
      optionalNumber(formData.get("mileage")) ?? 0,

    fuelLevel:
      optionalNumber(formData.get("fuelLevel")) ?? 100,

    status:
      optionalString(formData.get("status")) ?? "AVAILABLE",

    depotId:
      optionalString(formData.get("depotId")),

    driverId:
      optionalString(formData.get("driverId")),

    purchaseDate:
      optionalDate(formData.get("purchaseDate")),

    purchasePrice:
      optionalNumber(formData.get("purchasePrice")),

    currentValue:
      optionalNumber(formData.get("currentValue")),

    ownershipType:
      optionalString(formData.get("ownershipType")) ?? "OWNED",

    leaseStartDate:
      optionalDate(formData.get("leaseStartDate")),

    leaseTermMonths:
      optionalNumber(formData.get("leaseTermMonths")),
  };

  const validationResult = updateTruckSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors =
      validationResult.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please check the highlighted fields and try again.",
      fieldErrors,
    };
  }

  try {
    const before = await getTruck(id);
    const truck = await updateTruck(
      id,
      validationResult.data,
    );
    await recordAudit({ action: "UPDATE", entityType: "Truck", entityId: truck.id, summary: `Updated truck ${truck.fleetNumber}`, before, after: truck });

    revalidatePath("/dashboard/fleet");
    revalidatePath(`/dashboard/fleet/${id}`);
    revalidatePath(`/dashboard/fleet/${id}/edit`);

    return {
      success: true,
      message: "Truck updated successfully.",
      truckId: truck.id,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the truck.",
    };
  }
}

export async function deleteTruckAction(
  id: string,
) {
  await authorize("fleet:manage");
  try {
    const before = await getTruck(id);
    await removeTruck(id);
    await recordAudit({ action: "DELETE", entityType: "Truck", entityId: id, summary: `Deleted truck ${before?.fleetNumber ?? id}`, before });

    revalidatePath("/dashboard/fleet");

    return {
      success: true,
      message: "Truck deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unable to delete the truck.",
    };
  }
}

export async function archiveTruckAction(id: string, archived: boolean) {
  await authorize("fleet:manage");
  try {
    const before = await getTruck(id);
    const truck = await archiveTruck(id, archived);
    await recordAudit({ action: archived ? "ARCHIVE" : "RESTORE", entityType: "Truck", entityId: id, summary: `${archived ? "Archived" : "Restored"} truck ${truck.fleetNumber}`, before, after: truck });
    revalidatePath("/dashboard/fleet");
    revalidatePath(`/dashboard/fleet/${id}`);
    return { success: true, message: archived ? "Truck archived safely." : "Truck restored to the active fleet." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to update archive status." };
  }
}
