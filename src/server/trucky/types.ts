import type { Prisma } from "@/src/generated/prisma/client";

export type JsonObject = Record<string, unknown>;

export type NormalizedJob = {
  truckyJobId: string;
  status: "STARTED" | "COMPLETED" | "CANCELLED" | "DELETED";
  truckyUserId?: string;
  steamId?: string;
  truckyUsername?: string;
  truckyVehicleId?: string;
  registration?: string;
  game?: string;
  sourceCity?: string;
  sourceCompany?: string;
  destinationCity?: string;
  destinationCompany?: string;
  cargo?: string;
  cargoMassKg?: number;
  distanceKm?: number;
  drivenDistanceKm?: number;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  revenue?: number;
  fuelCost?: number;
  tollCost?: number;
  ferryCost?: number;
  damageCost?: number;
  otherCosts?: number;
  profit?: number;
  currency: string;
  damagePercent?: number;
  truckWearPercent?: number;
  trailerWearPercent?: number;
  fuelUsedLitres?: number;
  averageFuelConsumption?: number;
  lastEventAt?: Date;
  rawPayload: Prisma.InputJsonValue;
};

export type ImportResult = {
  jobId: string;
  created: boolean;
  driverMatched: boolean;
  truckMatched: boolean;
};
