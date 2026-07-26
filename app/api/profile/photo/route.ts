import { NextResponse } from "next/server";
import sharp from "sharp";

import { prisma } from "@/src/lib/prisma";
import { getCurrentAccount } from "@/src/lib/session";

const maxUploadBytes = 5 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function profileRedirect(request: Request, status: string) {
  const publicOrigin =
    process.env.APP_URL ??
    (process.env.DISCORD_REDIRECT_URI
      ? new URL(process.env.DISCORD_REDIRECT_URI).origin
      : new URL(request.url).origin);
  const url = new URL("/profile", publicOrigin);
  url.searchParams.set("photo", status);
  return NextResponse.redirect(url, 303);
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) {
    return new Response(null, { status: 401 });
  }

  const profile = await prisma.account.findUnique({
    where: { id: account.id },
    select: { profileImage: true, profileImageMime: true },
  });
  if (!profile?.profileImage || !profile.profileImageMime) {
    return new Response(null, { status: 404 });
  }

  return new Response(profile.profileImage, {
    headers: {
      "content-type": profile.profileImageMime,
      "cache-control": "private, no-store",
      "x-content-type-options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  const account = await getCurrentAccount();
  if (!account) {
    const publicOrigin =
      process.env.APP_URL ??
      (process.env.DISCORD_REDIRECT_URI
        ? new URL(process.env.DISCORD_REDIRECT_URI).origin
        : new URL(request.url).origin);
    return NextResponse.redirect(
      new URL("/login?next=%2Fprofile", publicOrigin),
      303,
    );
  }

  const formData = await request.formData();
  const photo = formData.get("photo");
  if (
    !(photo instanceof File) ||
    photo.size === 0 ||
    photo.size > maxUploadBytes ||
    !acceptedTypes.has(photo.type)
  ) {
    return profileRedirect(request, "invalid");
  }

  try {
    const normalized = await sharp(Buffer.from(await photo.arrayBuffer()))
      .rotate()
      .resize(512, 512, { fit: "cover", position: "attention" })
      .webp({ quality: 82 })
      .toBuffer();

    await prisma.account.update({
      where: { id: account.id },
      data: {
        profileImage: normalized,
        profileImageMime: "image/webp",
        profileImageUpdatedAt: new Date(),
      },
    });

    return profileRedirect(request, "saved");
  } catch {
    return profileRedirect(request, "invalid");
  }
}
