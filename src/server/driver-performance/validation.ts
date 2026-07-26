import { z } from "zod";

export const driverPerformanceEntrySchema = z.object({
  driverId: z.string().trim().min(1, "Driver is required."),
  customerId: z.string().trim().min(1, "Company is required."),
  contractListingId: z.string().trim().optional(),
  distanceKm: z.number().int().positive("Distance must be greater than zero."),
  cargoTonnes: z.number().min(0, "Cargo cannot be negative.").max(1000),
  income: z.number().positive("Job income must be greater than zero so an invoice can be created."),
  expenditure: z.number().min(0, "Expenditure cannot be negative.").optional(),
  repairCosts: z.number().min(0, "Repair costs cannot be negative.").default(0),
  damageCosts: z.number().min(0, "Damage costs cannot be negative.").default(0),
  otherCosts: z.number().min(0, "Other costs cannot be negative.").optional(),
  reputationScore: z.number().min(0).max(100),
  completedAt: z
    .date()
    .refine(
      (value) => value <= new Date(),
      "Completion date cannot be in the future.",
    ),
  notes: z.string().trim().max(1000).optional(),
}).transform((data) => {
  const otherCosts = data.otherCosts ?? data.expenditure ?? 0;
  return {
    ...data,
    otherCosts,
    expenditure: data.repairCosts + data.damageCosts + otherCosts,
  };
});

export type DriverPerformanceEntryInput = z.infer<
  typeof driverPerformanceEntrySchema
>;
