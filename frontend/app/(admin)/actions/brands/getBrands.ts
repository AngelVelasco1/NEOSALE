"use server";

import { prisma } from "@/lib/prisma";

export async function getBrandsDropdown() {
  try {
    const brands = await prisma.brands.findMany({
      where: {
        active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return brands;
  } catch (error) {
    
    throw new Error("Failed to fetch brands");
  }
}
