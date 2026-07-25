import { z } from "zod";
import { fuelTypes } from "./types.ts";

const optionalText = z.string().trim().max(1000).optional();

export const fuelEntrySchema = z.object({
  truckId: z.string().min(1, "Select a truck."),
  fuelType: z.enum(fuelTypes),
  quantity: z.number().positive("Enter a quantity greater than zero."),
  unitPrice: z.number().positive("Enter a unit price greater than zero."),
  odometerKm: z.number().int().nonnegative("Odometer cannot be negative."),
  fuelLevelAfter: z.number().int().min(0).max(100).optional(),
  station: z.string().trim().min(2, "Enter the fuel station.").max(120),
  location: z.string().trim().max(160).optional(),
  receiptNumber: z.string().trim().max(80).optional(),
  purchasedAt: z.date(),
  notes: optionalText,
});
