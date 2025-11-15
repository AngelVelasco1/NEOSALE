"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";
import { OrderStatus } from "@/app/(admin)/services/orders/types";

export async function changeOrderStatus(
  orderId: string,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  try {
    await prisma.orders.update({
      where: { id: parseInt(orderId) },
      data: { status: newOrderStatus as any }, // TODO: Ajustar tipo según tu enum
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Failed to update order status." };
  }
}
