import test from "node:test";
import assert from "node:assert/strict";
import { normalizeJob, eventFingerprint } from "../src/server/trucky/normalize.ts";

test("Trucky job payloads normalize stable identity, route, telemetry and finances", () => {
  const payload = {
    event: "job_completed",
    data: {
      id: "job-123",
      user: { id: "user-9", steam_profile: { steam_id: "76561198000000000", steam_username: "ElJefe" } },
      vehicle: { id: "vehicle-4", registration: "EJL 001" },
      source: { city: "London", company: "SellPlan" },
      destination: { city: "Paris", company: "Tradeaux" },
      cargo: "Medical equipment",
      driven_distance_km: 462,
      revenue: 5000,
      economy: { fuel_cost: 450, toll_cost: 60 },
      telemetry: { truck_wear: 24, damage: 3.5, fuel_used: 150 },
      completed_at: "2026-07-26T12:00:00.000Z",
    },
  };
  const job = normalizeJob(payload, payload.event);
  assert.equal(job.truckyJobId, "job-123");
  assert.equal(job.steamId, "76561198000000000");
  assert.equal(job.status, "COMPLETED");
  assert.equal(job.destinationCity, "Paris");
  assert.equal(job.drivenDistanceKm, 462);
  assert.equal(job.profit, 4490);
  assert.equal(job.truckWearPercent, 24);
});

test("webhook fingerprints are deterministic and payload-sensitive", () => {
  assert.equal(eventFingerprint('{"a":1}'), eventFingerprint('{"a":1}'));
  assert.notEqual(eventFingerprint('{"a":1}'), eventFingerprint('{"a":2}'));
});

test("Trucky payloads without a stable job id are rejected", () => {
  assert.throws(() => normalizeJob({ data: { cargo: "Logs" } }), /stable job id/);
});

test("real Trucky API job shape accepts numeric IDs and flat route fields", () => {
  const job = normalizeJob({
    id: 12345,
    user_id: 88,
    vehicle_id: 42,
    source_city_name: "Madrid",
    source_company_name: "Transinet",
    destination_city_name: "London",
    destination_company_name: "SellPlan",
    cargo_name: "Medical equipment",
    cargo_mass_t: 18.5,
    planned_distance_km: 1900,
    driven_distance_km: 1925,
    vehicle_damage: 2.4,
    fuel_used_l: 612,
    fuel_economy_l100km: 31.8,
    revenue: 7500,
    completed_at: "2026-07-26T12:00:00.000Z",
    updated_at: "2026-07-26T12:01:00.000Z",
    driver: { id: 88, name: "El Jefe" },
    game: { id: 1, code: "ETS2", name: "Euro Truck Simulator 2" },
  });
  assert.equal(job.truckyJobId, "12345");
  assert.equal(job.truckyUserId, "88");
  assert.equal(job.truckyVehicleId, "42");
  assert.equal(job.game, "ETS2");
  assert.equal(job.sourceCity, "Madrid");
  assert.equal(job.destinationCity, "London");
  assert.equal(job.cargoMassKg, 18500);
  assert.equal(job.distanceKm, 1900);
  assert.equal(job.drivenDistanceKm, 1925);
  assert.equal(job.damagePercent, 2.4);
  assert.equal(job.fuelUsedLitres, 612);
  assert.equal(job.averageFuelConsumption, 31.8);
  assert.equal(job.lastEventAt.toISOString(), "2026-07-26T12:01:00.000Z");
});
