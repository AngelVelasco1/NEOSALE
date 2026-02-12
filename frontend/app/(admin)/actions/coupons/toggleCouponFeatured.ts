"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

const MAX_FEATURED_COUPONS = 3;

export async function toggleCouponFeatured(
  couponId: number,
  currentFeaturedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newFeaturedStatus = !currentFeaturedStatus;

    // Si se va a activar como destacado, verificar el límite
    if (newFeaturedStatus) {
      const featuredCount = await prisma.coupons.count({
        where: {
          featured: true,
          deleted_at: null,
          active: true,
        },
      });

      if (featuredCount >= MAX_FEATURED_COUPONS) {
        return { 
          success: false,
          error: `No se pueden destacar más de ${MAX_FEATURED_COUPONS} cupones. Desactiva uno primero.` 
        };
      }
    }

    await prisma.coupons.update({
      where: { id: couponId },
      data: { featured: newFeaturedStatus },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Failed to update coupon featured status." };
  }
}
