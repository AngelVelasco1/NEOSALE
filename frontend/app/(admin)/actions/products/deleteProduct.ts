"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteProduct(
  productId: string
): Promise<ServerActionResponse> {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return { dbError: "Unauthorized. Please log in." };
  }

  const userId = parseInt(session.user.id);

  // Verificar permisos de admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, active: true },
  });

  if (!user || !user.active || user.role !== "admin") {
    return { dbError: "Unauthorized. Admin access required." };
  }

  try {
    const productIdInt = parseInt(productId);

    // Obtener el producto con sus imágenes
    const product = await prisma.products.findUnique({
      where: { id: productIdInt },
      include: { images: true },
    });

    if (!product) {
      return { dbError: "Product not found." };
    }

    // Eliminar imágenes de Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        try {
          await deleteImageFromCloudinary(image.image_url);
        } catch (error) {
          console.error("Failed to delete image from Cloudinary:", error);
          // Continuar aunque falle la eliminación de la imagen
        }
      }
    }

    // Eliminar el producto (Prisma eliminará automáticamente las imágenes y variantes por CASCADE)
    await prisma.products.delete({
      where: { id: productIdInt },
    });

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { dbError: "Something went wrong. Could not delete the product." };
  }
}
