"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupons(
  couponIds: string[]
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina las imágenes aquí
    // const coupons = await prisma.coupons.findMany({
    //   where: { id: { in: couponIds.map(id => parseInt(id)) } },
    //   select: { image_url: true }
    // });

    await prisma.coupons.deleteMany({
      where: {
        id: { in: couponIds.map((id) => parseInt(id)) },
      },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database bulk delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the coupons." };
  }
}
