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
