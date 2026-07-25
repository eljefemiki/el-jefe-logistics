import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission, rolePermissions } from "../src/lib/permissions.ts";

test("CEO has every enterprise permission", () => {
  assert.equal(hasPermission("CEO", "settings:manage"), true);
  assert.equal(hasPermission("CEO", "audit:view"), true);
});
test("specialist roles are constrained to their centres", () => {
  assert.equal(hasPermission("FINANCE", "finance:manage"), true);
  assert.equal(hasPermission("FINANCE", "fleet:manage"), false);
  assert.equal(hasPermission("WORKSHOP", "workshop:manage"), true);
  assert.equal(hasPermission("DRIVER", "settings:view"), false);
});
test("applicants have no dashboard permissions", () => {
  assert.deepEqual(rolePermissions.APPLICANT, []);
});
