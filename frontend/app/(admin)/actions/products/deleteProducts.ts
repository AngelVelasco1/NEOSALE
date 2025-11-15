"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteProducts(
  productIds: string[]
): Promise<ServerActionResponse> {
  try {
    // TODO: Si usas Cloudinary u otro servicio, elimina las imágenes aquí
    // const products = await prisma.products.findMany({
    //   where: { id: { in: productIds.map(id => parseInt(id)) } },
    //   include: { images: true }
    // });

    await prisma.products.deleteMany({
      where: {
        id: { in: productIds.map((id) => parseInt(id)) },
      },
    });

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Database bulk delete failed:", error);
    return { dbError: "Something went wrong. Could not delete the products." };
  }
}
