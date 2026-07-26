import "dotenv/config";
import pg from "pg";

const mode = process.argv[2];
if (!["local", "production"].includes(mode)) {
  console.error("Usage: node scripts/trucky-preflight.mjs <local|production>");
  process.exit(2);
}
const checks = [];
const add = (name, ok, detail) => checks.push({ name, ok, detail });
const value = (name) => process.env[name]?.trim();
const required = ["DATABASE_URL", "TRUCKY_COMPANY_ID", "TRUCKY_COMPANY_TOKEN", "TRUCKY_WEBHOOK_SECRET"];
if (mode === "production") required.push("AUTH_SECRET", "TRUCKY_SYNC_SECRET");
for (const name of required) add(`Environment: ${name}`, Boolean(value(name)), value(name) ? "configured" : "missing");
const apiBaseUrl = value("TRUCKY_API_BASE_URL") ?? "https://e.truckyapp.com/api/v1";
try {
  const parsed = new URL(apiBaseUrl);
  add("Trucky API URL", parsed.protocol === "https:" || (mode === "local" && parsed.protocol === "http:"), parsed.origin);
} catch { add("Trucky API URL", false, "invalid URL"); }
if (value("DATABASE_URL")) {
  const client = new pg.Client({ connectionString: value("DATABASE_URL"), connectionTimeoutMillis: 5_000 });
  try {
    await client.connect();
    await client.query("SELECT 1");
    const schema = await client.query(`SELECT to_regclass('"TransportJob"') AS jobs, to_regclass('"TruckyEvent"') AS events, to_regclass('"TruckySyncState"') AS sync_state`);
    const row = schema.rows[0];
    add("Database connection", true, "reachable");
    add("Trucky database migration", Boolean(row.jobs && row.events && row.sync_state), row.jobs && row.events && row.sync_state ? "applied" : "required tables are missing");
  } catch (error) { add("Database connection", false, error instanceof Error ? error.message : "connection failed"); }
  finally { await client.end().catch(() => {}); }
}
if (value("TRUCKY_COMPANY_ID") && value("TRUCKY_COMPANY_TOKEN")) {
  try {
    const response = await fetch(`${apiBaseUrl.replace(/\/$/, "")}/company/${encodeURIComponent(value("TRUCKY_COMPANY_ID"))}/jobs`, {
      headers: { "x-access-token": value("TRUCKY_COMPANY_TOKEN"), accept: "application/json", "content-type": "application/json", "user-agent": value("TRUCKY_USER_AGENT") ?? "El Jefe Logistics Driver Hub" },
      signal: AbortSignal.timeout(10_000),
    });
    add("Trucky API credentials", response.ok, response.ok ? `authenticated (${response.status})` : `request returned ${response.status}`);
  } catch (error) { add("Trucky API credentials", false, error instanceof Error ? error.message : "request failed"); }
}
const width = Math.max(...checks.map((check) => check.name.length));
console.log(`Trucky ${mode} pre-flight`);
for (const check of checks) console.log(`${check.ok ? "PASS" : "FAIL"}  ${check.name.padEnd(width)}  ${check.detail}`);
const failed = checks.filter((check) => !check.ok);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exitCode = 1;
