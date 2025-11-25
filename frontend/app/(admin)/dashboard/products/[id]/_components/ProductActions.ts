"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProductField(
  productId: number,
  field: string,
  value: string | number | boolean
) {
  try {
    const updateData: Record<string, any> = { [field]: value };

    // Si se está actualizando, agregar updated_at
    updateData.updated_at = new Date();

    await prisma.products.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Error updating product field:", error);
    return { success: false, error: "Error al actualizar el campo" };
  }
}

export async function toggleProductStatus(
  productId: number,
  isActive: boolean
) {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: {
        active: isActive,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Error toggling product status:", error);
    return { success: false, error: "Error al cambiar el estado" };
  }
}

export async function toggleProductOffer(productId: number, inOffer: boolean) {
  try {
    const updateData: Record<string, any> = {
      in_offer: inOffer,
      updated_at: new Date(),
    };

    // Si se está desactivando la oferta, limpiar campos relacionados
    if (!inOffer) {
      updateData.offer_discount = null;
      updateData.offer_start_date = null;
      updateData.offer_end_date = null;
    }

    await prisma.products.update({
      where: { id: productId },
      data: updateData,
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Error toggling product offer:", error);
    return { success: false, error: "Error al cambiar el estado de oferta" };
  }
}

export async function updateProductStock(productId: number, stock: number) {
  try {
    if (stock < 0) {
      return { success: false, error: "El stock no puede ser negativo" };
    }

    await prisma.products.update({
      where: { id: productId },
      data: {
        stock: stock,
        updated_at: new Date(),
      },
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Error updating product stock:", error);
    return { success: false, error: "Error al actualizar el stock" };
  }
}

export async function updateProductPrice(productId: number, price: number) {
  try {
    if (price <= 0) {
      return { success: false, error: "El precio debe ser mayor a 0" };
    }

    await prisma.products.update({
      where: { id: productId },
      data: {
        price: Math.round(price), // Asegurar que sea un entero
        updated_at: new Date(),
      },
    });

    revalidatePath(`/dashboard/products/${productId}`);
    revalidatePath("/dashboard/products");

    return { success: true };
  } catch (error) {
    console.error("Error updating product price:", error);
    return { success: false, error: "Error al actualizar el precio" };
  }
}
