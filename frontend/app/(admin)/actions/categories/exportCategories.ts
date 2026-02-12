"use server";

import { prisma } from "@/lib/prisma";

export async function exportCategories() {
  try {
    const data = await prisma.categories.findMany();

    return { data };
  } catch (error) {
    
    return { error: `Failed to fetch data for categories.` };
  }
}
