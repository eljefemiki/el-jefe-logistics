import { z } from "zod";
import { ets2TrailerTypes } from "../../lib/ets2-trailers.ts";

export const driverStatusSchema = z.enum([
  "AVAILABLE",
  "DRIVING",
  "OFF_DUTY",
  "ON_LEAVE",
  "SUSPENDED",
]);

export const driverRankSchema = z.enum([
  "TRAINEE",
  "JUNIOR",
  "SENIOR",
  "ELITE",
]);

export const updateDriverSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(80, "First name is too long")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(80, "Last name is too long")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(160, "Email address is too long")
    .optional(),

  employeeNumber: z
    .string()
    .trim()
    .min(1, "Employee number is required")
    .max(40, "Employee number is too long")
    .optional(),

  callsign: z
    .string()
    .trim()
    .max(50, "Callsign is too long")
    .optional(),

  rank: driverRankSchema.optional(),
  status: driverStatusSchema.optional(),

  reputation: z
    .number()
    .min(0, "Reputation cannot be below 0")
    .max(100, "Reputation cannot exceed 100")
    .optional(),

  totalDistanceKm: z
    .number()
    .int()
    .min(0, "Distance cannot be negative")
    .optional(),

  totalDeliveries: z
    .number()
    .int()
    .min(0, "Deliveries cannot be negative")
    .optional(),

  totalConvoys: z
    .number()
    .int()
    .min(0, "Convoys cannot be negative")
    .optional(),

  favouriteTruck: z
    .string()
    .trim()
    .max(80, "Favourite truck is too long")
    .optional(),

  assignedTrailer: z.enum(ets2TrailerTypes).nullable().optional(),
  truckyUserId: z.string().trim().max(120, "Trucky user ID is too long").optional(),
  steamId: z.string().trim().regex(/^\d{17}$/, "Steam ID must contain exactly 17 digits").optional(),
  truckyUsername: z.string().trim().max(120, "Trucky username is too long").optional(),

  joinedAt: z
    .date()
    .optional(),

  notes: z
    .string()
    .trim()
    .max(1200, "Notes are too long")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateDriverData = z.infer<typeof updateDriverSchema>;
