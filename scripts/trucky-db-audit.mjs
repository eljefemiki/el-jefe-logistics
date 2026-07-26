import "dotenv/config";
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5_000 });
try {
  await client.connect();
  const counts = await client.query(`SELECT
    (SELECT count(*) FROM "TruckyEvent")::int AS events,
    (SELECT count(*) FROM "TruckyEvent" WHERE error IS NOT NULL AND "processedAt" IS NULL)::int AS failed_events,
    (SELECT count(*) FROM "TransportJob")::int AS jobs,
    (SELECT count(*) FROM "TransportJob" WHERE "driverId" IS NULL)::int AS unmatched_drivers,
    (SELECT count(*) FROM "TransportJob" WHERE "truckId" IS NULL)::int AS unmatched_trucks,
    (SELECT count(*) FROM "Driver" WHERE "archivedAt" IS NULL)::int AS drivers,
    (SELECT count(*) FROM "Driver" WHERE "archivedAt" IS NULL AND ("truckyUserId" IS NOT NULL OR "steamId" IS NOT NULL))::int AS mapped_drivers,
    (SELECT count(*) FROM "Truck")::int AS trucks,
    (SELECT count(*) FROM "Truck" WHERE "truckyVehicleId" IS NOT NULL)::int AS mapped_trucks`);
  const sync = await client.query(`SELECT "lastStartedAt","lastCompletedAt","lastSuccessfulAt",imported,failed,("lastError" IS NOT NULL) AS has_error FROM "TruckySyncState" WHERE id='company'`);
  const webhook = await client.query(`SELECT "eventType","receivedAt",("processedAt" IS NOT NULL) AS processed,(error IS NOT NULL) AS failed FROM "TruckyEvent" ORDER BY "receivedAt" DESC LIMIT 1`);
  console.log(JSON.stringify({ counts: counts.rows[0], sync: sync.rows[0] ?? null, lastWebhook: webhook.rows[0] ?? null }, null, 2));
} finally { await client.end().catch(() => {}); }
