"use server";

import { revalidatePath } from "next/cache";

import { createServerActionClient } from "@/app/(admin)/lib/supabase/server-action";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";
import { OrderStatus } from "@/app/(admin)/services/orders/types";

export async function changeOrderStatus(
  orderId: string,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  const supabase = createServerActionClient();

  const { error: dbError } = await supabase
    .from("orders")
    .update({ status: newOrderStatus })
    .eq("id", orderId);

  if (dbError) {
    console.error("Database update failed:", dbError);
    return { dbError: "Failed to update order status." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}
