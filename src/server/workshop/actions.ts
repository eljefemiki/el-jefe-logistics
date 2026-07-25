"use server";

import { revalidatePath } from "next/cache";
import { createMaintenanceJob, updateMaintenanceJob } from "./service";
import { maintenanceJobSchema } from "./validation";
import { authorize } from "@/src/lib/auth";
import { recordAudit } from "@/src/server/platform/audit";
import { notify } from "@/src/server/platform/notifications";

export interface MaintenanceActionState {
  success: boolean;
  message: string;
  jobId?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

const text = (value: FormDataEntryValue | null) =>
  typeof value === "string" && value.trim() ? value.trim() : undefined;
const number = (value: FormDataEntryValue | null) => {
  const raw = text(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};
const date = (value: FormDataEntryValue | null) => {
  const raw = text(value);
  if (!raw) return undefined;
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

function parse(formData: FormData) {
  return maintenanceJobSchema.safeParse({
    truckId: text(formData.get("truckId")) ?? "",
    title: text(formData.get("title")) ?? "",
    description: text(formData.get("description")),
    type: text(formData.get("type")),
    priority: text(formData.get("priority")),
    status: text(formData.get("status")),
    odometerKm: number(formData.get("odometerKm")),
    technician: text(formData.get("technician")),
    vendor: text(formData.get("vendor")),
    scheduledFor: date(formData.get("scheduledFor")),
    estimatedCost: number(formData.get("estimatedCost")),
    actualCost: number(formData.get("actualCost")),
    notes: text(formData.get("notes")),
  });
}

async function run(formData: FormData, id?: string): Promise<MaintenanceActionState> {
  await authorize("workshop:manage");
  const result = parse(formData);
  if (!result.success) {
    return { success: false, message: "Please check the highlighted fields.", fieldErrors: result.error.flatten().fieldErrors };
  }
  try {
    const job = id
      ? await updateMaintenanceJob(id, result.data)
      : await createMaintenanceJob(result.data);
    await Promise.all([
      recordAudit({ action: id ? "UPDATE" : "CREATE", entityType: "MaintenanceJob", entityId: job.id, summary: `${id ? "Updated" : "Created"} work order ${job.jobNumber}`, after: job }),
      notify({ title: id ? "Work order updated" : "Work order opened", message: job.jobNumber, type: "WORKSHOP", severity: job.priority === "CRITICAL" ? "CRITICAL" : "INFO", entityType: "MaintenanceJob", entityId: job.id, entityHref: `/dashboard/maintenance/${job.id}` }),
    ]);
    revalidatePath("/dashboard/maintenance");
    revalidatePath("/dashboard/fleet");
    revalidatePath(`/dashboard/fleet/${job.truckId}`);
    return { success: true, message: id ? "Work order updated." : "Work order created.", jobId: job.id };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Unable to save the work order." };
  }
}

export async function createMaintenanceJobAction(_state: MaintenanceActionState, formData: FormData) {
  return run(formData);
}

export async function updateMaintenanceJobAction(id: string, _state: MaintenanceActionState, formData: FormData) {
  return run(formData, id);
}
