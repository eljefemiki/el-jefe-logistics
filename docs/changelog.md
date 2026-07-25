# 1.1.0 release readiness

- Updated Next.js and its ESLint configuration from 16.2.10 to 16.2.11.
- Resolved vulnerable Sharp, Valibot, PostCSS, Fast URI, brace expansion, and Prisma toolchain dependencies without a forced audit fix.
- Restricted approved dependency install scripts to Prisma and `@prisma/engines`; other package scripts remain unapproved.
- Added critical validation tests for authentication, fleet, driver editing, customers, maintenance, fuel, invoices, marketplace listings/bids, and permissions.
- Required an explicit `AUTH_SECRET` in production and removed the database URL as a session-signing fallback.
- Protected fleet and driver API routes with authenticated role checks.
- Restricted marketplace publishing and bid awards to the account that created the listing, and rejected bids against non-open listings.
- Added a backup and restore runbook with restore verification and sensitive-data handling guidance.

## Customer CRM v0.8.0

- Added a persisted customer account model with lifecycle status, primary and billing contacts, address, credit limit, payment terms and relationship notes.
- Added `/dashboard/customers` with account KPIs, search, status filtering, archived-record visibility and operational loading, error and empty states.
- Added customer create, profile and edit routes backed by validation, repository, service and server-action layers.
- Added archive and restore controls so customer history can be retained safely.
- Connected Customer CRM to dashboard navigation and revalidation of the Dispatch Centre.

### Remaining Customer CRM Work

- Quotes, orders, journeys and invoices require their own persisted models before account activity can be fully automated.
- Customer contacts are currently represented by one primary contact; multi-contact management requires a dedicated contact model.
- Account activity history and document attachments are not yet database-backed.

## Fuel Centre v0.7.0

- Added the `FuelEntry` model, `FuelType` enum and database migration.
- Added Fuel Centre repository, validation, service and server-action layers.
- Added dashboard, create, detail and edit routes with operational states.
- Connected Fuel Centre to fleet vehicle data and dashboard navigation.

## Workshop & Maintenance Centre v0.6.0

- Added persisted maintenance work orders linked to fleet trucks, with work type, priority, status, scheduling, technician/vendor ownership, odometer, costs and notes.
- Added `/dashboard/maintenance` with live workshop KPIs, search, status and priority filters, plus loading, error and empty states.
- Added create, detail and edit work-order routes, with validated server actions and service/repository separation.
- Truck availability now moves to `MAINTENANCE` when a work order opens and returns to `AVAILABLE` after its final active work order is completed or cancelled.
- Added Workshop navigation and connected the Fleet vehicle operational module to the centre.

### Remaining Workshop Work

- Parts inventory, purchase orders, attachments and audit-event history require dedicated persisted models.
- Technician records are currently stored as names until a workshop staff model is introduced.
- Automated service intervals and MOT reminders are not yet scheduled.
## Finance Centre v0.9.0

- Added a persisted customer invoice ledger with VAT and payment tracking.
- Added Finance Centre KPIs, filters, invoice details and create/edit workflows.
- Connected Finance Centre to active Customer CRM accounts and dashboard navigation.
# 1.0.0 - JefeCore Enterprise platform layer

- Added shared Notifications, Documents, Audit Event and Company Settings data models and indexes.
- Added signed HTTP-only sessions, central role permissions, protected dashboard routes/actions and role-aware navigation.
- Added Notifications Centre, Global Search, Document Centre, Audit Centre and Settings Centre.
- Replaced the dashboard placeholder with live cross-module executive KPIs.
- Added audit and notification hooks to critical finance, CRM, fleet, driver, workshop and fuel workflows.
- Added GBP/en-GB company defaults, integration/storage placeholders, responsive navigation cleanup and permission tests.
