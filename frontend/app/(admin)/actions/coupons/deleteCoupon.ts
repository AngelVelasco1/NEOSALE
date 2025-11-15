"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupon(
  couponId: string
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina la imagen aquí
    // const coupon = await prisma.coupons.findUnique({
    //   where: { id: parseInt(couponId) },
    //   select: { image_url: true }
    // });

    await prisma.coupons.delete({
      where: { id: parseInt(couponId) },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the coupon." };
  }
}
