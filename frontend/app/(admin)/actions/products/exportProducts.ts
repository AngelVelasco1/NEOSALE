"use server";

import { prisma } from "@/lib/prisma";

export async function exportProducts() {
  try {
    const data = await prisma.products.findMany({
      include: {
        categories: {
          select: {
            name: true,
          },
        },
      },
    });
    const serialized = data.map((product) => ({
      ...product,
      price: product.price ? Number(product.price) : null,
      base_discount: product.base_discount ? Number(product.base_discount) : null,
      offer_discount: product.offer_discount ? Number(product.offer_discount) : null,
      weight_grams: product.weight_grams ? Number(product.weight_grams) : null,
      offer_start_date: product.offer_start_date ? product.offer_start_date.toISOString() : null,
      offer_end_date: product.offer_end_date ? product.offer_end_date.toISOString() : null,
      created_at: product.created_at ? product.created_at.toISOString() : null,
      updated_at: product.updated_at ? product.updated_at.toISOString() : null,
      deleted_at: product.deleted_at ? product.deleted_at.toISOString() : null,
    }));

    return { data: serialized };
  } catch (error) {
    
    return { error: `Failed to fetch data for products.` };
  }
}
