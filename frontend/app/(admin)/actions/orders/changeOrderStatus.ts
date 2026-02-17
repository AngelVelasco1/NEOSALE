"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function changeOrderStatus(
  orderId: number,
  newOrderStatus: string
): Promise<ServerActionResponse> {
  try {
    if (!orderId || orderId <= 0) {
      return { validationError: "ID de orden inválido" };
    }

    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newOrderStatus)) {
      return { validationError: "Estado de orden inválido" };
    }

    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, {
      status: newOrderStatus,
    });

    if (!response.success) {
      return { success: false, error: response.error || "No se pudo actualizar el estado de la orden." };
    }

    return { success: true };
  } catch (error) {
    console.error("[changeOrderStatus] Error:", error);
    return { success: false, error: "No se pudo actualizar el estado de la orden. Por favor, inténtalo de nuevo." };
  }
}
