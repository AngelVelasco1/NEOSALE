"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCategoryPublishedStatus(
  categoryId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newPublishedStatus = !currentPublishedStatus;

    await prisma.categories.update({
      where: { id: parseInt(categoryId) },
      data: { active: newPublishedStatus },
    });

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update category status." };
  }
}
