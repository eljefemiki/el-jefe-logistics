import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyHmacSha256 } from "../src/server/trucky/signature.ts";

test("Trucky webhook signature accepts the exact raw body", () => {
  const secret = "test-only-webhook-secret";
  const rawBody = '{"event":"job_created","data":{"id":"simulation-only"}}';
  const signature = createHmac("sha256", secret).update(rawBody).digest("hex");
  assert.equal(verifyHmacSha256(rawBody, signature, secret), true);
});

test("Trucky webhook signature rejects altered bodies and invalid signatures", () => {
  const secret = "test-only-webhook-secret";
  const rawBody = '{"event":"job_created","data":{"id":"simulation-only"}}';
  const signature = createHmac("sha256", secret).update(rawBody).digest("hex");
  assert.equal(verifyHmacSha256(`${rawBody} `, signature, secret), false);
  assert.equal(verifyHmacSha256(rawBody, "not-a-signature", secret), false);
  assert.equal(verifyHmacSha256(rawBody, null, secret), false);
});
