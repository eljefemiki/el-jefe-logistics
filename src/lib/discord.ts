import "server-only";

export const discordStateCookie = "jefecore_discord_oauth_state";

export function getDiscordConfig(origin: string) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!clientId || !clientSecret || !guildId) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    guildId,
    redirectUri:
      process.env.DISCORD_REDIRECT_URI ??
      `${origin}/api/discord/callback`,
  };
}
