ALTER TABLE "Account"
ADD COLUMN "steamId" TEXT,
ADD COLUMN "truckyUserId" TEXT,
ADD COLUMN "truckyUsername" TEXT,
ADD COLUMN "discordId" TEXT;

CREATE UNIQUE INDEX "Account_steamId_key" ON "Account"("steamId");
CREATE UNIQUE INDEX "Account_truckyUserId_key" ON "Account"("truckyUserId");
CREATE UNIQUE INDEX "Account_discordId_key" ON "Account"("discordId");
