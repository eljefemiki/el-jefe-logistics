import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyHmacSha256(rawBody: string, supplied: string | null, secret: string | undefined) {
  if (!secret || !supplied) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const left = Buffer.from(expected, "utf8");
  const right = Buffer.from(supplied.trim().toLowerCase(), "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}
