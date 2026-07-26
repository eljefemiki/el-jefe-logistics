import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  discordStateCookie,
  getDiscordConfig,
} from "@/src/lib/discord";
import { getDiscordPublicOrigin } from "@/src/lib/discord-origin";
import { prisma } from "@/src/lib/prisma";
import { getCurrentAccount } from "@/src/lib/session";

interface DiscordTokenResponse {
  access_token: string;
}

interface DiscordUser {
  id: string;
  username: string;
  global_name: string | null;
}

interface DiscordGuildMember {
  joined_at: string | null;
  pending?: boolean;
}

function profileRedirect(origin: string, status: string) {
  return NextResponse.redirect(
    new URL(`/profile?discord=${status}`, origin),
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const account = await getCurrentAccount();
  const cookieStore = await cookies();
  const storedState = cookieStore.get(discordStateCookie)?.value;
  const returnedState = requestUrl.searchParams.get("state");
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const config = getDiscordConfig(requestUrl.origin);
  const publicOrigin = config
    ? getDiscordPublicOrigin(config.redirectUri)
    : requestUrl.origin;

  cookieStore.delete(discordStateCookie);

  if (!account) {
    return NextResponse.redirect(
      new URL("/login?next=%2Fprofile", publicOrigin),
    );
  }

  if (error) {
    return profileRedirect(publicOrigin, "denied");
  }

  if (!config || !code || !storedState || returnedState !== storedState) {
    return profileRedirect(publicOrigin, "failed");
  }

  try {
    const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUri,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) {
      return profileRedirect(publicOrigin, "failed");
    }

    const token = (await tokenResponse.json()) as DiscordTokenResponse;
    const authorization = { Authorization: `Bearer ${token.access_token}` };
    const [userResponse, memberResponse] = await Promise.all([
      fetch("https://discord.com/api/v10/users/@me", {
        headers: authorization,
        cache: "no-store",
      }),
      fetch(
        `https://discord.com/api/v10/users/@me/guilds/${config.guildId}/member`,
        { headers: authorization, cache: "no-store" },
      ),
    ]);

    if (memberResponse.status === 404) {
      return profileRedirect(publicOrigin, "not_member");
    }

    if (!userResponse.ok || !memberResponse.ok) {
      return profileRedirect(publicOrigin, "failed");
    }

    const user = (await userResponse.json()) as DiscordUser;
    const member = (await memberResponse.json()) as DiscordGuildMember;

    if (member.pending) {
      return profileRedirect(publicOrigin, "not_member");
    }

    await prisma.account.update({
      where: { id: account.id },
      data: {
        discordId: user.id,
        discordUsername: user.username,
        discordDisplayName: user.global_name,
        discordVerifiedAt: new Date(),
        discordGuildJoinedAt: member.joined_at
          ? new Date(member.joined_at)
          : null,
      },
    });

    return profileRedirect(publicOrigin, "verified");
  } catch (error) {
    console.error("Discord verification failed:", error);
    return profileRedirect(publicOrigin, "failed");
  }
}
