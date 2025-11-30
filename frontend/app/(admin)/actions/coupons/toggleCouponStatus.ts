"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCouponActiveStatus(
  couponId: number,
  currentActiveStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newActiveStatus = !currentActiveStatus;

    await prisma.coupons.update({
      where: { id: couponId },
      data: { active: newActiveStatus },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update coupon status." };
  }
}
