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

    return { data };
  } catch (error) {
    console.error(`Error fetching products:`, error);
    return { error: `Failed to fetch data for products.` };
  }
}
