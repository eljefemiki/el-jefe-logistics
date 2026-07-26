"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAccount } from "@/src/lib/session";
import { prisma } from "@/src/lib/prisma";
import { privateProfileSchema } from "@/src/lib/validation";

export interface PrivateProfileActionState {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

export async function updatePrivateProfileAction(
  _previousState: PrivateProfileActionState,
  formData: FormData,
): Promise<PrivateProfileActionState> {
  const account = await getCurrentAccount();

  if (!account) {
    return { success: false, message: "Please sign in again before updating your profile." };
  }

  const validation = privateProfileSchema.safeParse({
    steamId: formData.get("steamId"),
    truckyUsername: formData.get("truckyUsername"),
  });

  if (!validation.success) {
    return {
      success: false,
      message: "Please check the highlighted fields.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.account.update({
      where: { id: account.id },
      data: validation.data,
    });

    revalidatePath("/profile");
    return { success: true, message: "Your private driver identities have been updated." };
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      return { success: false, message: "That Steam ID is already linked to another account." };
    }

    return { success: false, message: "Your profile could not be updated. Please try again." };
  }
}
