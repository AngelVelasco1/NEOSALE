"use server";

import { prisma } from "@/lib/prisma";

export async function exportCoupons() {
  try {
    const data = await prisma.coupons.findMany();

    return { data };
  } catch (error) {
    
    return { error: `Failed to fetch data for coupons.` };
  }
}
