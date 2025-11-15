"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategory(
  categoryId: string
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina la imagen aquí
    // const category = await prisma.categories.findUnique({
    //   where: { id: parseInt(categoryId) },
    //   select: { image_url: true }
    // });

    await prisma.categories.delete({
      where: { id: parseInt(categoryId) },
    });

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Database delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the category." };
  }
}
