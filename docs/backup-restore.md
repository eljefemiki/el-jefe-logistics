# Backup and restore

## Scope

Back up the PostgreSQL database, deployment configuration, and any external document storage separately. The current application stores document metadata and approved external URLs, not uploaded file contents.

## Backup

1. Put the application into a maintenance window or otherwise prevent writes.
2. Create a PostgreSQL custom-format backup with the deployment provider's managed backup facility or `pg_dump --format=custom`.
3. Encrypt the backup at rest, restrict access to the operations team, and retain copies in a separate failure domain.
4. Record the application version, Prisma migration state, PostgreSQL version, backup timestamp, and checksum.
5. Test a restore on a non-production database on a regular schedule.

Do not place database credentials, session secrets, raw backups, or provider recovery keys in the repository.

## Restore verification

1. Provision an empty PostgreSQL database using a compatible server version.
2. Restore the custom-format backup with the provider tooling or `pg_restore`.
3. Configure `DATABASE_URL` and a strong, independent `AUTH_SECRET`.
4. Run `npx prisma migrate status` and apply only migrations that post-date the restored backup.
5. Run `npx prisma generate`, the typecheck, tests, and production build.
6. Verify login, role permissions, record counts, recent invoices, marketplace awards, and maintenance/fleet state before reopening writes.

Recovery time and recovery point objectives, retention periods, encryption keys, and the named restore owner must be set in the production operations runbook. `backup/ovhbackup.txt` is provider-specific working material and is intentionally not modified by this document.
