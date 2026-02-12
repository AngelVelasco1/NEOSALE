"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCustomer(
  customerId: string
): Promise<ServerActionResponse> {
  try {
    await prisma.user.delete({
      where: { id: parseInt(customerId) },
    });

    revalidatePath("/customers");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Something went wrong. Could not delete the customer." };
  }
}
