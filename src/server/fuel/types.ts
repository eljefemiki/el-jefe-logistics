export const fuelTypes = ["DIESEL", "HVO", "ADBLUE", "ELECTRIC", "OTHER"] as const;
export type FuelType = (typeof fuelTypes)[number];

export interface FuelEntryInput {
  truckId: string;
  fuelType: FuelType;
  quantity: number;
  unitPrice: number;
  odometerKm: number;
  fuelLevelAfter?: number;
  station: string;
  location?: string;
  receiptNumber?: string;
  purchasedAt: Date;
  notes?: string;
}

export interface FuelFilters {
  search?: string;
  fuelType?: FuelType;
  truckId?: string;
}
