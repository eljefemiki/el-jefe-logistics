import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { hashPassword } from "@/src/lib/hash";
import { registerSchema } from "@/src/lib/validation";

function splitName(name: string) {
  const cleanName = name.trim();

  const parts = cleanName
    .split(/\s+/)
    .filter(Boolean);

  const firstName = parts[0] || "User";
  const lastName =
    parts.length > 1
      ? parts.slice(1).join(" ")
      : "";

  return {
    firstName,
    lastName,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: result.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      name,
      password,
      steamId,
      truckyUserId,
      truckyUsername,
      discordId,
    } = result.data;
    const email = result.data.email.trim().toLowerCase();

    const existingAccount = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (existingAccount) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const {
      firstName,
      lastName,
    } = splitName(name);

    const passwordHash =
      await hashPassword(password);

    const account = await prisma.account.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        steamId,
        truckyUserId,
        truckyUsername,
        discordId,
        role: "APPLICANT",
        isActive: true,
        emailVerified: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully.",
        user: {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          name: `${account.firstName} ${account.lastName}`.trim(),
          email: account.email,
          role: account.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          message: "One of these account or driver IDs is already registered.",
        },
        { status: 409 }
      );
    }

    console.error("Registration error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}
