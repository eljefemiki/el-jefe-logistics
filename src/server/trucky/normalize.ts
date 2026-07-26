import { createHash } from "node:crypto";
import type { JsonObject, NormalizedJob } from "./types";

const object = (value: unknown): JsonObject =>
  value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
const pick = (source: JsonObject, ...keys: string[]) => {
  for (const key of keys) if (source[key] !== undefined && source[key] !== null) return source[key];
};
const text = (value: unknown) => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return undefined;
};
const number = (value: unknown) => {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : undefined;
};
const integer = (value: unknown) => {
  const parsed = number(value);
  return parsed === undefined ? undefined : Math.round(parsed);
};
const date = (value: unknown) => {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export function eventFingerprint(rawBody: string) {
  return createHash("sha256").update(rawBody).digest("hex");
}

export function normalizeJob(input: unknown, eventType = "job_completed"): NormalizedJob {
  const root = object(input);
  const data = object(root.data ?? root);
  const user = object(data.user ?? data.driver ?? data.member);
  const steam = object(data.steam_profile ?? user.steam_profile);
  const vehicle = object(data.vehicle ?? data.truck);
  const source = object(data.source ?? data.origin);
  const destination = object(data.destination);
  const economy = object(data.economy ?? data.finances);
  const telemetry = object(data.telemetry ?? data.stats);
  const externalId = text(pick(data, "id", "_id", "job_id", "jobId", "uuid"));
  if (!externalId) throw new Error("Trucky job payload has no stable job id.");

  const eventStatus = eventType === "job_created" ? "STARTED"
    : eventType === "job_canceled" ? "CANCELLED"
    : eventType === "job_deleted" ? "DELETED" : "COMPLETED";
  const revenue = number(pick(data, "revenue", "income", "price")) ?? number(pick(economy, "revenue", "income"));
  const fuelCost = number(pick(data, "fuel_cost", "fuelCost")) ?? number(pick(economy, "fuel_cost", "fuelCost"));
  const tollCost = number(pick(data, "toll_cost", "tollCost")) ?? number(pick(economy, "toll_cost", "tollCost"));
  const ferryCost = number(pick(data, "ferry_cost", "ferryCost")) ?? number(pick(economy, "ferry_cost", "ferryCost"));
  const damageCost = number(pick(data, "damage_cost", "damageCost")) ?? number(pick(economy, "damage_cost", "damageCost"));
  const otherCosts = number(pick(data, "other_costs", "otherCosts")) ?? number(pick(economy, "other_costs", "otherCosts"));
  const calculatedProfit = revenue === undefined ? undefined
    : revenue - (fuelCost ?? 0) - (tollCost ?? 0) - (ferryCost ?? 0) - (damageCost ?? 0) - (otherCosts ?? 0);

  return {
    truckyJobId: externalId,
    status: eventStatus,
    truckyUserId: text(pick(user, "id", "_id", "user_id", "userId")) ?? text(pick(data, "user_id", "userId")),
    steamId: text(pick(steam, "steam_id", "steamId")) ?? text(pick(user, "steam_id", "steamId")),
    truckyUsername: text(pick(steam, "steam_username", "username")) ?? text(pick(user, "username", "name")),
    truckyVehicleId: text(pick(vehicle, "id", "_id", "vehicle_id", "vehicleId")) ?? text(pick(data, "vehicle_id", "vehicleId")),
    registration: text(pick(vehicle, "registration", "license_plate", "plate")),
    game: text(pick(object(data.game), "code", "name")) ?? text(pick(data, "game", "game_name", "gameName", "game_id")),
    sourceCity: text(pick(source, "city", "city_name", "cityName")) ?? text(pick(data, "source_city_name", "source_city", "sourceCity")),
    sourceCompany: text(pick(source, "company", "company_name", "companyName")) ?? text(pick(data, "source_company_name", "source_company", "sourceCompany")),
    destinationCity: text(pick(destination, "city", "city_name", "cityName")) ?? text(pick(data, "destination_city_name", "destination_city", "destinationCity")),
    destinationCompany: text(pick(destination, "company", "company_name", "companyName")) ?? text(pick(data, "destination_company_name", "destination_company", "destinationCompany")),
    cargo: text(pick(data, "cargo", "cargo_name", "cargoName")),
    cargoMassKg: number(pick(data, "cargo_mass_kg", "cargoMassKg", "cargo_weight"))
      ?? (number(pick(data, "cargo_mass_t")) === undefined ? undefined : number(pick(data, "cargo_mass_t"))! * 1_000),
    distanceKm: integer(pick(data, "distance", "distance_km", "planned_distance_km", "planned_distance")) ?? integer(pick(telemetry, "distance", "distance_km")),
    drivenDistanceKm: integer(pick(data, "driven_distance", "drivenDistance", "driven_distance_km")) ?? integer(pick(telemetry, "driven_distance", "distance")),
    startedAt: date(pick(data, "started_at", "startedAt", "start_time")),
    completedAt: eventStatus === "COMPLETED" ? date(pick(data, "completed_at", "completedAt", "finish_time")) ?? new Date() : undefined,
    cancelledAt: eventStatus === "CANCELLED" ? date(pick(data, "cancelled_at", "cancelledAt")) ?? new Date() : undefined,
    revenue, fuelCost, tollCost, ferryCost, damageCost, otherCosts,
    profit: number(pick(data, "profit")) ?? number(pick(economy, "profit")) ?? calculatedProfit,
    currency: text(pick(data, "currency")) ?? text(pick(economy, "currency")) ?? "EUR",
    damagePercent: number(pick(data, "damage", "damage_percent", "damagePercent", "vehicle_damage", "total_damage")) ?? number(pick(telemetry, "damage", "damage_percent")),
    truckWearPercent: number(pick(data, "truck_wear", "truckWear", "wear_percent")) ?? number(pick(telemetry, "truck_wear", "wear")),
    trailerWearPercent: number(pick(data, "trailer_wear", "trailerWear")) ?? number(pick(telemetry, "trailer_wear")),
    fuelUsedLitres: number(pick(data, "fuel_used_l", "fuel_used", "fuelUsed", "fuel_litres")) ?? number(pick(telemetry, "fuel_used")),
    averageFuelConsumption: number(pick(data, "fuel_economy_l100km", "average_fuel_consumption", "averageFuelConsumption")) ?? number(pick(telemetry, "average_fuel_consumption")),
    lastEventAt: date(pick(data, "updated_at", "updatedAt", "completed_at", "created_at")) ?? new Date(),
    rawPayload: JSON.parse(JSON.stringify(data)),
  };
}
