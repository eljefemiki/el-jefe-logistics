import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";

const databaseUrl = process.env.TEST_DATABASE_URL;
const baseUrl = process.env.TEST_BASE_URL;
const authSecret = process.env.AUTH_SECRET;
const enabled = Boolean(databaseUrl && baseUrl && authSecret);
const runId = `acceptance-${process.pid}-${Date.now()}`;

function token(accountId) {
  const signature = createHmac("sha256", authSecret).update(accountId).digest("base64url");
  return `${accountId}.${signature}`;
}

async function api(path, accountId) {
  return fetch(new URL(path, baseUrl), {
    headers: accountId ? { cookie: `jefecore_session=${token(accountId)}` } : {},
  });
}

test("fleet and driver APIs enforce the complete role matrix", { skip: !enabled }, async () => {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
  const roles = ["CEO", "MANAGER", "HR", "DISPATCHER", "FLEET_MANAGER", "FINANCE", "WORKSHOP", "DRIVER", "APPLICANT"];
  const accounts = new Map();
  for (const role of roles) {
    const account = await prisma.account.create({
      data: {
        email: `${runId}-${role.toLowerCase()}@example.test`,
        passwordHash: "acceptance-only",
        firstName: "Release",
        lastName: role,
        role,
      },
    });
    accounts.set(role, account.id);
  }

  const expectations = {
    "/api/fleet": new Set(["CEO", "MANAGER", "DISPATCHER", "FLEET_MANAGER", "WORKSHOP", "DRIVER"]),
    "/api/drivers": new Set(["CEO", "MANAGER", "HR", "DISPATCHER", "FLEET_MANAGER"]),
    "/api/fleet/release-check": new Set(["CEO", "MANAGER", "DISPATCHER", "FLEET_MANAGER", "WORKSHOP", "DRIVER"]),
  };
  for (const [path, allowed] of Object.entries(expectations)) {
    assert.equal((await api(path)).status, 401, `${path} must reject anonymous access`);
    for (const role of roles) {
      const expected = allowed.has(role) ? 200 : 403;
      assert.equal((await api(path, accounts.get(role))).status, expected, `${path} returned the wrong status for ${role}`);
    }
  }
  await prisma.$disconnect();
});
