import { z } from "zod";

export const driverPerformanceEntrySchema = z.object({
  driverId: z.string().trim().min(1, "Driver is required."),
  customerId: z.string().trim().min(1, "Company is required."),
  contractListingId: z.string().trim().optional(),
  distanceKm: z.number().int().positive("Distance must be greater than zero."),
  cargoTonnes: z.number().min(0, "Cargo cannot be negative.").max(1000),
  income: z.number().min(0, "Income cannot be negative."),
  expenditure: z.number().min(0, "Expenditure cannot be negative."),
  reputationScore: z.number().min(0).max(100),
  completedAt: z
    .date()
    .refine(
      (value) => value <= new Date(),
      "Completion date cannot be in the future.",
    ),
  notes: z.string().trim().max(1000).optional(),
});

export type DriverPerformanceEntryInput = z.infer<
  typeof driverPerformanceEntrySchema
>;
