-- Discord identity is now supplied by OAuth rather than typed by the driver.
-- Trucky username remains the only Trucky identifier required.
DROP INDEX IF EXISTS "Account_truckyUserId_key";

ALTER TABLE "Account"
DROP COLUMN "truckyUserId",
ADD COLUMN "discordUsername" TEXT,
ADD COLUMN "discordDisplayName" TEXT,
ADD COLUMN "discordVerifiedAt" TIMESTAMP(3),
ADD COLUMN "discordGuildJoinedAt" TIMESTAMP(3);
