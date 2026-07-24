import { z } from "zod";
import { maintenancePriorities, maintenanceStatuses, maintenanceTypes } from "./types";

const optionalText = z.string().trim().max(2000).optional();

export const maintenanceJobSchema = z.object({
  truckId: z.string().min(1, "Select a truck."),
  title: z.string().trim().min(3, "Enter a descriptive job title.").max(120),
  description: optionalText,
  type: z.enum(maintenanceTypes),
  priority: z.enum(maintenancePriorities),
  status: z.enum(maintenanceStatuses),
  odometerKm: z.number().int().nonnegative().optional(),
  technician: z.string().trim().max(120).optional(),
  vendor: z.string().trim().max(120).optional(),
  scheduledFor: z.date().optional(),
  estimatedCost: z.number().nonnegative().optional(),
  actualCost: z.number().nonnegative().optional(),
  notes: optionalText,
});
