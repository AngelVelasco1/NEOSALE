"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleCategoryPublishedStatus(
  categoryId: string,
  currentActiveStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const newActiveStatus = !currentActiveStatus;

    await prisma.categories.update({
      where: { id: parseInt(categoryId) },
      data: { active: newActiveStatus },
    });

    revalidatePath("/dashboard/categories");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update category status." };
  }
}
