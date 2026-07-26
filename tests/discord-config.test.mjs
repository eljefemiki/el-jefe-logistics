import test from "node:test";
import assert from "node:assert/strict";

test("Discord redirects use the configured public callback origin", async () => {
  process.env.DISCORD_CLIENT_ID = "client";
  process.env.DISCORD_CLIENT_SECRET = "secret";
  process.env.DISCORD_GUILD_ID = "guild";
  process.env.DISCORD_REDIRECT_URI =
    "https://eljefelogistics.com/api/discord/callback";

  const { getDiscordPublicOrigin } = await import(
    "../src/lib/discord-origin.ts"
  );
  assert.equal(
    getDiscordPublicOrigin(process.env.DISCORD_REDIRECT_URI),
    "https://eljefelogistics.com",
  );
});
