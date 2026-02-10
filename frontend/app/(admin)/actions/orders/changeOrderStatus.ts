// @ts-nocheck
"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";
import { OrderStatus } from "@/app/(admin)/services/orders/types";

export async function changeOrderStatus(
  orderId: number,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  try {
    // Validar que el orderId sea válido
    if (!orderId || orderId <= 0) {
      return { 
        validationError: "ID de orden inválido" 
      };
    }

    // Validar que el estado sea válido
    const validStatuses: OrderStatus[] = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(newOrderStatus)) {
      return { 
        validationError: "Estado de orden inválido" 
      };
    }

    // Actualizar el estado de la orden
    await prisma.orders.update({
      where: { id: orderId },
      data: { 
        status: newOrderStatus,
        updated_at: new Date(),
      },
    });

    // Revalidar las rutas relacionadas
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar estado de orden:", error);
    return { 
      success: false,
      error: "No se pudo actualizar el estado de la orden. Por favor, inténtalo de nuevo." 
    };
  }
}
