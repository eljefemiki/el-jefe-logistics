export const customerStatuses = ["LEAD", "ACTIVE", "ON_HOLD", "INACTIVE"] as const;
export type CustomerStatus = (typeof customerStatuses)[number];

export interface CustomerInput {
  companyName: string;
  status: CustomerStatus;
  contactFirstName: string;
  contactLastName: string;
  email: string;
  phone?: string;
  billingEmail?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  country: string;
  creditLimit?: number;
  paymentTermsDays: number;
  notes?: string;
}

export interface CustomerFilters {
  search?: string;
  status?: CustomerStatus;
  includeArchived?: boolean;
}
