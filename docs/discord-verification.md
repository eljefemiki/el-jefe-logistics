# Discord driver verification

JefeCore links Discord accounts through Discord OAuth2. Drivers never type a
Discord ID. Discord supplies the permanent account ID and JefeCore confirms
that the same account is a non-pending member of the configured server.

## Discord application setup

1. Create an application in the Discord Developer Portal.
2. Under OAuth2, add this redirect:
   `https://eljefelogistics.com/api/discord/callback`
3. Copy the application ID and client secret.
4. In Discord, enable Developer Mode, right-click the El Jefe Logistics server,
   and copy its server ID.

## Production settings

Add these values to `/etc/jefecore/jefecore.env`:

```dotenv
DISCORD_CLIENT_ID="your-application-id"
DISCORD_CLIENT_SECRET="your-client-secret"
DISCORD_GUILD_ID="your-server-id"
DISCORD_REDIRECT_URI="https://eljefelogistics.com/api/discord/callback"
```

Restart JefeCore after changing the environment file.

## Data retained

After successful authorization, JefeCore stores the Discord account ID,
username, display name, verification time, and server join time. OAuth access
tokens are used only during verification and are not stored.

Drivers can reverify from their private profile if their username changes.
