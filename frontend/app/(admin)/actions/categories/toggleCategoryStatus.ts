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
    
    return { success: false, error: "Failed to update category status." };
  }
}
