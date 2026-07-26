import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import {
  discordStateCookie,
  getDiscordConfig,
} from "@/src/lib/discord";
import { getDiscordPublicOrigin } from "@/src/lib/discord-origin";
import { getCurrentAccount } from "@/src/lib/session";

export async function GET(request: Request) {
  const account = await getCurrentAccount();
  const requestUrl = new URL(request.url);

  const config = getDiscordConfig(requestUrl.origin);
  if (!config) {
    return NextResponse.redirect(
      new URL("/profile?discord=failed", requestUrl.origin),
    );
  }
  const publicOrigin = getDiscordPublicOrigin(config.redirectUri);

  if (!account) {
    return NextResponse.redirect(
      new URL("/login?next=%2Fprofile", publicOrigin),
    );
  }

  const state = randomBytes(32).toString("base64url");
  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: "identify guilds.members.read",
    state,
    prompt: "consent",
  }).toString();

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(discordStateCookie, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60,
    path: "/api/discord/callback",
  });

  return response;
}
