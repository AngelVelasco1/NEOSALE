"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupon(
  couponId: number
): Promise<ServerActionResponse> {
  try {
    // Soft delete: solo marcamos como eliminado
    await prisma.coupons.update({
      where: { id: couponId },
      data: {
        deleted_at: new Date(),
        // TODO: Obtener userId de la sesión
        // deleted_by: userId,
      },
    });

    revalidatePath("/dashboard/coupons");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Something went wrong. Could not delete the coupon." };
  }
}
