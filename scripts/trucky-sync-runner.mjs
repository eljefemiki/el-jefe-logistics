import "dotenv/config";

const url = process.env.TRUCKY_SYNC_URL ?? "http://127.0.0.1:3000/api/integrations/trucky/sync";
const secret = process.env.TRUCKY_SYNC_SECRET;
if (!secret) {
  console.error("Trucky scheduled sync failed: TRUCKY_SYNC_SECRET is not configured.");
  process.exit(1);
}

try {
  const response = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${secret}`, accept: "application/json" },
    signal: AbortSignal.timeout(120_000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`sync endpoint returned ${response.status}`);
  console.log("Trucky scheduled sync completed", {
    received: result.received ?? 0,
    imported: result.imported ?? 0,
    failed: result.failed ?? 0,
  });
  if (result.failed) process.exitCode = 1;
} catch (error) {
  console.error("Trucky scheduled sync failed", {
    message: error instanceof Error ? error.message : "Unknown scheduler error",
  });
  process.exitCode = 1;
}
