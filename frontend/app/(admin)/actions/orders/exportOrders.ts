"use server";

import { prisma } from "@/lib/prisma";
import { OrdersExport } from "@/app/(admin)/services/orders/types";
import { getDiscount } from "@/app/(admin)/helpers/getDiscount";

export async function exportOrders() {
  try {
    const data = await prisma.orders.findMany({
      include: {
        coupons: {
          select: {
            discount_type: true,
            discount_value: true,
          },
        },
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return {
      data: data.map(
        (order): OrdersExport => ({
          id: order.id,
          invoice_no: order.id.toString(), // TODO: Ajustar según tu lógica de invoice_no
          customer_name: order.User?.name ?? "",
          customer_email: order.User?.email ?? "",
          total_amount: Number(order.total),
          discount: getDiscount({
            coupon: order.coupons,
            totalAmount: Number(order.total),
            shippingCost: Number(order.shipping_cost),
          }),
          shipping_cost: Number(order.shipping_cost),
          payment_method: "N/A", // TODO: Obtener del payment relacionado
          order_time: order.created_at,
          status: order.status,
          created_at: order.created_at,
          updated_at: order.updated_at,
        })
      ),
    };
  } catch (error) {
    console.error(`Error fetching orders:`, error);
    return { error: `Failed to fetch data for orders.` };
  }
}
