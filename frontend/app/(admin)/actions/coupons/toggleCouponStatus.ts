"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCouponPublishedStatus(
  couponId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newPublishedStatus = !currentPublishedStatus;

    await prisma.coupons.update({
      where: { id: parseInt(couponId) },
      data: { active: newPublishedStatus },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update coupon status." };
  }
}
