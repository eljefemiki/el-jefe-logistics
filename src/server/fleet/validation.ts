import { z } from "zod";

const currentYear = new Date().getFullYear();

export const truckStatusSchema = z.enum([
  "AVAILABLE",
  "DELIVERING",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
]);

export const truckManufacturerSchema = z.enum([
  "VOLVO",
  "SCANIA",
  "DAF",
  "MAN",
  "MERCEDES",
  "RENAULT",
  "IVECO",
]);

export const truckTypeSchema = z.enum([
  "TRACTOR",
  "RIGID",
]);

export const truckOwnershipTypeSchema = z.enum(["OWNED", "LEASED"]);
export const leaseTermSchema = z.union([
  z.literal(24),
  z.literal(36),
  z.literal(48),
]);

const truckFields = {
  fleetNumber: z
    .string()
    .trim()
    .min(1, "Fleet number is required")
    .max(30, "Fleet number is too long"),

  registration: z
    .string()
    .trim()
    .min(1, "Registration is required")
    .max(30, "Registration is too long"),

  manufacturer: truckManufacturerSchema,

  model: z
    .string()
    .trim()
    .min(1, "Model is required")
    .max(100, "Model name is too long"),

  type: truckTypeSchema.default("TRACTOR"),

  year: z
    .number()
    .int()
    .min(1950, "Year must be 1950 or later")
    .max(
      currentYear + 1,
      `Year cannot be later than ${currentYear + 1}`,
    ),

  colour: z
    .string()
    .trim()
    .max(50)
    .optional(),

  mileage: z
    .number()
    .int()
    .min(0, "Mileage cannot be negative")
    .default(0),

  fuelLevel: z
    .number()
    .int()
    .min(0, "Fuel level cannot be below 0")
    .max(100, "Fuel level cannot exceed 100")
    .default(100),

  status: truckStatusSchema.default("AVAILABLE"),

  depotId: z
    .string()
    .trim()
    .optional(),

  driverId: z
    .string()
    .trim()
    .optional(),

  purchaseDate: z
    .date()
    .optional(),

  purchasePrice: z
    .number()
    .min(0)
    .optional(),

  currentValue: z
    .number()
    .min(0)
    .optional(),

  ownershipType: truckOwnershipTypeSchema.default("OWNED"),

  leaseStartDate: z.date().optional(),

  leaseTermMonths: leaseTermSchema.optional(),
};

function validateLease(
  value: {
    ownershipType?: "OWNED" | "LEASED";
    purchasePrice?: number;
    leaseStartDate?: Date;
    leaseTermMonths?: 24 | 36 | 48;
  },
  context: z.RefinementCtx,
) {
  if (value.ownershipType !== "LEASED") return;

  if (!value.purchasePrice || value.purchasePrice <= 0) {
    context.addIssue({
      code: "custom",
      path: ["purchasePrice"],
      message: "Vehicle value is required for a lease.",
    });
  }

  if (!value.leaseStartDate) {
    context.addIssue({
      code: "custom",
      path: ["leaseStartDate"],
      message: "Lease start date is required.",
    });
  }

  if (!value.leaseTermMonths) {
    context.addIssue({
      code: "custom",
      path: ["leaseTermMonths"],
      message: "Select a 24, 36, or 48-month lease.",
    });
  }
}

export const createTruckSchema = z.object(truckFields).superRefine(validateLease);

export const updateTruckSchema = z.object(truckFields).partial().superRefine(validateLease);

export type CreateTruckData =
  z.infer<typeof createTruckSchema>;

export type UpdateTruckData =
  z.infer<typeof updateTruckSchema>;
