# Trucky VTC Hub integration

The integration imports Trucky jobs into JefeCore, updates driver delivery totals and vehicle mileage, records job economics, and creates workshop issues when job telemetry reports damage or material wear.

## Configure

1. In Trucky VTC Hub, open Company Settings and the API/Integrations area.
2. Claim the Company Access Token and generate a webhook secret.
3. Configure the `TRUCKY_*` variables shown in `.env.example` in the deployment platform. Tokens and secrets must never be committed.
4. Configure Trucky's webhook URL as `https://<your-domain>/api/integrations/trucky/webhook`.
5. Enable job events (`job_created`, `job_completed`, `job_canceled`, and `job_deleted`) plus vehicle events as Trucky makes them available.
6. Run the Prisma migration during deployment.
7. Perform an initial backfill by sending an authenticated `POST` to `/api/integrations/trucky/sync` while signed in as a dispatch manager, or use `Authorization: Bearer <TRUCKY_SYNC_SECRET>` from a scheduler.

## Pre-flight checks

Run `npm run preflight:trucky:local` before starting locally. On the production
server, run `npm run preflight:trucky:production` after loading its environment
file and before restarting the application. These read-only checks validate the
required variables, database/schema access, and Trucky company credentials.

Run `npm run audit:trucky:database` for aggregate synchronization, webhook, job,
and mapping health. It never prints secrets or source payloads.

## Driver and vehicle matching

Jobs are linked to existing records by `Driver.truckyUserId` or `Driver.steamId`, and by `Truck.truckyVehicleId` or registration. The stable IDs should be added during driver and fleet onboarding. Unmatched jobs are retained and visible in Trucky Jobs so they can be reconciled without losing data.

## Processing guarantees

- Webhook signatures are validated against the exact raw request body using HMAC SHA-256.
- A SHA-256 payload fingerprint prevents duplicate webhook processing.
- Jobs use Trucky's job ID as an upsert key, so webhook delivery and API backfill can overlap safely.
- Driver deliveries, distance, and truck mileage increment only on the first transition to completed.
- Full source payloads are retained for troubleshooting and future field mapping.
- The Trucky company token is only sent server-side with the required custom User-Agent.

## Finance and workshop

Every job stores revenue, component costs, calculated profit, and currency. Completed jobs without an invoice appear as uninvoiced in the Trucky Jobs dashboard. `Invoice.transportJobId` provides a one-to-one audit link when an invoice is raised; customer selection remains an internal commercial decision because Trucky job payloads do not identify a JefeCore customer.

Damage over 1% and wearing-parts readings over 20% create idempotent workshop issues linked to the job and truck. Workshop staff can use those records to triage repairs and schedule service work.
