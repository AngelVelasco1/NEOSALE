"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCoupons(
  couponIds: number[]
): Promise<ServerActionResponse> {
  try {
    // Soft delete masivo: solo marcamos como eliminados
    await prisma.coupons.updateMany({
      where: {
        id: { in: couponIds },
      },
      data: {
        deleted_at: new Date(),
        // TODO: Obtener userId de la sesión
        // deleted_by: userId,
      },
    });

    revalidatePath("/dashboard/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database bulk delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the coupons." };
  }
}
