import { z } from "zod";
import { cargoCategories, ets2TrailerTypes, isTrailerCompatible } from "../../lib/ets2-trailers.ts";

export const contractListingSchema = z.object({
  customerId: z.string().min(1, "Select a customer."),
  title: z.string().trim().min(5, "Enter a descriptive title.").max(140),
  description: z.string().trim().min(20, "Add enough detail for carriers to quote accurately.").max(3000),
  origin: z.string().trim().min(2).max(160),
  destination: z.string().trim().min(2).max(160),
  cargoType: z.string().trim().min(2).max(100),
  cargoCategory: z.enum(cargoCategories),
  requiredTrailer: z.enum(ets2TrailerTypes),
  weightKg: z.number().positive().max(100000).optional(),
  pickupDate: z.date(),
  deliveryDate: z.date(),
  budget: z.number().positive("Budget must be greater than zero."),
  currency: z.string().trim().length(3).transform((value) => value.toUpperCase()),
  contractTerms: z.string().trim().min(20, "Add the commercial and service terms.").max(5000),
  publish: z.boolean(),
})
  .refine((value) => value.deliveryDate >= value.pickupDate, { path: ["deliveryDate"], message: "Delivery must be on or after pickup." })
  .refine((value) => isTrailerCompatible(value.cargoCategory, value.requiredTrailer), {
    path: ["requiredTrailer"],
    message: "This trailer cannot carry the selected ETS2 cargo category.",
  });

export const contractBidSchema = z.object({
  amount: z.number().positive("Bid amount must be greater than zero."),
  estimatedDays: z.number().int().min(1).max(365),
  proposal: z.string().trim().min(20, "Explain how the contract will be fulfilled.").max(3000),
});
