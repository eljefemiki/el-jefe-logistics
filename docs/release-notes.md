# JefeCore v1.1.0 release notes

JefeCore v1.1.0 builds on the enterprise fleet, driver, customer, maintenance, fuel, finance, authentication, permissions, audit, notification, document-metadata, and company-settings modules with a persisted smart contract marketplace.

Security and release hardening includes Next.js 16.2.11, a non-vulnerable Sharp resolution, safe transitive dependency updates, production-only enforcement of an independent `AUTH_SECRET`, explicit Prisma install-script approvals, marketplace owner checks, server-side workflow validation, protected dashboard routes, and expanded critical workflow tests.

Document uploads remain a metadata/external-link placeholder; no binary upload endpoint is enabled. Dispatch remains a live capacity/readiness view because a persisted dispatch assignment and journey model is not yet present. Driver creation also remains intentionally deferred until a secure invitation/onboarding workflow is designed.

Before production deployment, apply all Prisma migrations in staging, perform a native provider backup/restore test, and configure production secrets, retention, recovery objectives, and operational ownership.

## Smart Contract Marketplace v1.1.0

- Added `/dashboard/marketplace` for persisted freight opportunities, commercial terms and competitive bids.
- Dispatch and management roles can draft or publish customer-linked contracts.
- Authenticated marketplace participants can submit carrier proposals with price and delivery estimates.
- Contract owners can atomically award one bid, accepting the winner and rejecting remaining pending bids.
- Added marketplace permissions, navigation, KPIs, search, status filtering, audit events and migration.

## Dispatch Centre v0.5.0

- Added `/dashboard/dispatch` as the operational command centre for the Customer -> Dispatch -> Driver/Truck -> Journey -> Fuel -> Maintenance -> Invoice chain.
- Added a Dispatch service read model under `src/server/dispatch` that combines live Driver Centre and Fleet Centre availability into dispatch capacity, readiness score and alerts.
- Added dispatch UI components for capacity KPIs, workflow stage map, live readiness and alerts.
- Added loading and error states for Dispatch Centre.
- Used live driver/truck availability where the current schema supports it.

### Remaining Dispatch Work

- Customer intake, journey planning, fuel logs, maintenance jobs and invoice generation are placeholders until dedicated persisted models are added.
- Dispatch assignment creation is not yet implemented because the schema does not yet include Dispatch, Customer, Journey or Invoice records.
- Driver and truck assignment history remains dependent on future relationship/history models.

## Driver Centre v0.4.0

- Added the Driver Centre dashboard route at `/dashboard/drivers` with live roster KPIs, search, rank/status filters, archived-driver visibility and empty/loading/error states.
- Added driver profile and edit routes at `/dashboard/drivers/[id]` and `/dashboard/drivers/[id]/edit`, using `getDriver(id)` and `notFound()` for invalid IDs.
- Added the Driver service layer under `src/server/drivers` with repository, mapper, validation, update, archive and restore flows.
- Added driver UI components for status/rank badges, roster table, filters, profile, edit form, archive/restore action and KPI cards.
- Added `/api/drivers` for a simple service-backed driver feed.
- Updated the dashboard sidebar to point Fleet and Drivers to their dashboard centre routes.

### Remaining Driver Work

- Add Driver is intentionally a placeholder because creating a Driver also requires a safe Account onboarding flow and password/invitation decision.
- Training records, licence documents and assignment history are placeholders until dedicated persisted models are added.
- Driver activity history is not yet database-backed.

## Fleet Centre v0.3.1

- Added the truck profile route at `/dashboard/fleet/[id]` using `getTruck(id)` from the Fleet service layer and `notFound()` for invalid IDs.
- Added the edit truck route at `/dashboard/fleet/[id]/edit`, reusing the existing truck form styling and validation flow.
- Added update and delete server actions backed by the current Fleet service layer.
- Added profile sections for truck header actions, operating stats, vehicle details, ownership data and maintenance/fuel/document placeholders.
- Replaced hard-coded Fleet Health values with live Fleet dashboard metrics and added live KPI cards to the Fleet page.
- Preserved the existing Fleet table, filters, Add Truck workflow and current visual language.

### Remaining Fleet Work

- Archive is not implemented because the current `Truck` schema has no `archivedAt` or equivalent soft-delete field.
- Maintenance, fuel and document modules are placeholders until dedicated persisted models are added.
- Activity history remains placeholder-backed until a truck activity model exists.
## Customer CRM v0.8.0

- JefeCore now provides a dedicated Customer CRM for lead and customer account management.
- Teams can create, search, filter, inspect and update customer accounts, contacts, addresses and commercial terms.
- Customer lifecycle status supports lead, active, on-hold and inactive accounts.
- Customer records can be archived and restored without losing relationship history.

## Workshop & Maintenance Centre v0.6.0

- JefeCore now has a persisted Workshop & Maintenance Centre for vehicle inspections, servicing, repairs and breakdown work.
- Workshop users can create, filter, inspect and update work orders while tracking urgency, ownership, dates, mileage and costs.
- Active work orders automatically keep affected trucks in maintenance; resolving the final active job returns the truck to service.
- The Fleet operational module and dashboard navigation now link directly to Workshop.

## Fuel Centre v0.7.0

- JefeCore now records fuel and energy purchases against individual fleet vehicles.
- Fuel Centre provides monthly spend, volume, average unit price and transaction KPIs.
- Users can search and filter the ledger, then create, inspect and edit transactions.
- The newest transaction keeps each truck's odometer and reported fuel level current.
## Finance Centre v0.9.0

- JefeCore now turns customer accounts into a searchable invoice and receivables ledger.
- Finance Centre shows invoiced, collected, outstanding and overdue value at a glance.
- Invoice workflows calculate VAT and balances while tracking lifecycle and payment dates.
- Customer billing identity and terms flow directly from Customer CRM.
# JefeCore Enterprise v1.0 release candidate

Phase 3 introduces the shared enterprise platform layer: authenticated role-based access, unified search, notifications, document metadata, searchable audit history, company settings, and executive reporting.

Storage providers and external integrations remain intentionally unconfigured. Document records accept approved external URLs until object storage is selected. Dispatch remains the existing readiness read model, so job and delay KPIs are explicitly reported as zero rather than presenting synthetic data.

Before production tagging, apply the v1.0 Prisma migration to the target database, configure a strong `AUTH_SECRET`, complete user acceptance testing with each role, and configure backup/retention policies for audit and document metadata.
