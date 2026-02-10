"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategories(
  categoryIds: string[]
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina las imágenes aquí
    // const categories = await prisma.categories.findMany({
    //   where: { id: { in: categoryIds.map(id => parseInt(id)) } },
    //   select: { image_url: true }
    // });

    await prisma.categories.deleteMany({
      where: {
        id: { in: categoryIds.map((id) => parseInt(id)) },
      },
    });

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Database bulk delete failed:", error);
    return {
      success: false,
      error: "Something went wrong. Could not delete the categories.",
    };
  }
}
