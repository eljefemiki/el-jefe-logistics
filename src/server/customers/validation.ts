import { z } from "zod";
import { customerStatuses } from "./types.ts";

const optionalText = (max: number) => z.string().trim().max(max).optional();

export const customerSchema = z.object({
  companyName: z.string().trim().min(2, "Enter the company name.").max(160),
  status: z.enum(customerStatuses),
  contactFirstName: z.string().trim().min(1, "Enter the contact's first name.").max(80),
  contactLastName: z.string().trim().min(1, "Enter the contact's last name.").max(80),
  email: z.email("Enter a valid contact email.").max(160),
  phone: optionalText(40),
  billingEmail: z.union([z.literal(""), z.email("Enter a valid billing email.")]).optional().transform((value) => value || undefined),
  addressLine1: optionalText(160),
  addressLine2: optionalText(160),
  city: optionalText(100),
  postcode: optionalText(20),
  country: z.string().trim().min(2, "Enter a country.").max(100),
  creditLimit: z.number().nonnegative("Credit limit cannot be negative.").optional(),
  paymentTermsDays: z.number().int().min(0).max(365),
  notes: optionalText(2000),
});
