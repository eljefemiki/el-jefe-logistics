import { NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/lib/hash";
import { loginSchema } from "@/src/lib/validation";
import { createSessionToken, sessionCookie } from "@/src/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = loginSchema.safeParse(body);

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

    const email = result.data.email.trim().toLowerCase();
    const { password } = result.data;

    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      include: {
        driver: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    if (!account.isActive || account.archivedAt) {
      return NextResponse.json(
        {
          success: false,
          message: "This account is currently unavailable.",
        },
        { status: 403 }
      );
    }

    const passwordValid = await verifyPassword(
      password,
      account.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        lastLogin: new Date(),
      },
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        name: `${account.firstName} ${account.lastName}`.trim(),
        email: account.email,
        role: account.role,
        emailVerified: account.emailVerified,
        driver: account.driver
          ? {
              id: account.driver.id,
              employeeNumber: account.driver.employeeNumber,
              callsign: account.driver.callsign,
              rank: account.driver.rank,
              status: account.driver.status,
            }
          : null,
      },
    });
    response.cookies.set(sessionCookie, createSessionToken(account.id), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: 60 * 60 * 12,
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}
