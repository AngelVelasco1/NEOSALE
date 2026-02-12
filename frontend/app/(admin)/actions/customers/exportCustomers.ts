"use server";

import { prisma } from "@/lib/prisma";

export async function exportCustomers() {
  try {
    const data = await prisma.user.findMany({
      where: { role: "user" },
    });

    return { data };
  } catch (error) {
    
    return { error: `Failed to fetch data for customers.` };
  }
}
