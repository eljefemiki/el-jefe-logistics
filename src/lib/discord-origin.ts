export function getDiscordPublicOrigin(redirectUri: string) {
  return new URL(redirectUri).origin;
}
