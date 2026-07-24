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
