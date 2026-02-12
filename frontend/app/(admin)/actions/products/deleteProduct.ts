// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteProduct(
  productId: string
): Promise<ServerActionResponse> {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const userId = parseInt(session.user.id);

  // Verificar permisos de admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, active: true },
  });

  if (!user || !user.active || user.role !== "admin") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  try {
    const productIdInt = parseInt(productId);

    // Verificar que el producto existe
    const product = await prisma.products.findUnique({
      where: { id: productIdInt },
      select: { id: true, name: true },
    });

    if (!product) {
      return { success: false, error: "Product not found." };
    }

    await prisma.products.update({
      where: { id: productIdInt },
      data: {
        active: false,
        updated_by: userId,
        updated_at: new Date(),
      },
    });

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    
    return {
      success: false,
      error: "Something went wrong. Could not deactivate the product.",
    };
  }
}
