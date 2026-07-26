import test from "node:test";
import assert from "node:assert/strict";

import { calculateLeaseSummary } from "../src/lib/fleet-finance.ts";

test("lease divides the full truck value across the selected term", () => {
  const summary = calculateLeaseSummary(
    120000,
    24,
    new Date("2025-01-15T00:00:00Z"),
    new Date("2025-07-15T00:00:00Z"),
  );

  assert.equal(summary.monthlyPayment, 5000);
  assert.equal(summary.paymentsMade, 6);
  assert.equal(summary.amountPaid, 30000);
  assert.equal(summary.remainingBalance, 90000);
  assert.equal(summary.progressPercent, 25);
  assert.equal(summary.endDate.toISOString(), "2027-01-15T00:00:00.000Z");
});

test("lease payoff never exceeds the vehicle value", () => {
  const summary = calculateLeaseSummary(
    144000,
    48,
    new Date("2020-01-01T00:00:00Z"),
    new Date("2026-01-01T00:00:00Z"),
  );

  assert.equal(summary.paymentsMade, 48);
  assert.equal(summary.remainingBalance, 0);
  assert.equal(summary.progressPercent, 100);
  assert.equal(summary.isPaidOff, true);
});
