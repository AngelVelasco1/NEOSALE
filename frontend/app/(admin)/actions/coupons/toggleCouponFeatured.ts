"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCouponFeatured(
  couponId: number,
  currentFeaturedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newFeaturedStatus = !currentFeaturedStatus;

    await prisma.coupons.update({
      where: { id: couponId },
      data: { featured: newFeaturedStatus },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update coupon featured status." };
  }
}
