import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeAuditValue } from "../src/lib/audit-sanitizer.ts";

test("audit evidence recursively redacts credentials without changing ordinary evidence", () => {
  const source = {
    email: "driver@example.test",
    passwordHash: "hash",
    nested: {
      clientSecret: "secret",
      accessToken: "token",
      status: "ACTIVE",
    },
    entries: [{ sessionId: "session", amount: 1250 }],
  };
  assert.deepEqual(sanitizeAuditValue(source), {
    email: "driver@example.test",
    passwordHash: "[REDACTED]",
    nested: {
      clientSecret: "[REDACTED]",
      accessToken: "[REDACTED]",
      status: "ACTIVE",
    },
    entries: [{ sessionId: "[REDACTED]", amount: 1250 }],
  });
});
