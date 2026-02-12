"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleProductPublishedStatus(
  productId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newPublishedStatus = !currentPublishedStatus;

    await prisma.products.update({
      where: { id: parseInt(productId) },
      data: { active: newPublishedStatus },
    });

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Failed to update product status." };
  }
}
