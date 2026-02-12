"use server";

import { prisma } from "@/lib/prisma";
import { OrdersExport } from "@/app/(admin)/services/orders/types";

export async function exportOrders() {
  try {
    const data = await prisma.orders.findMany({
      include: {
        coupons: {
          select: {
            code: true,
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
        payments: {
          select: {
            transaction_id: true,
            payment_method: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    // Serializar Decimals y aplanar estructura para CSV
    const serializedData: OrdersExport[] = data.map((order) => ({
      id: order.id,
      payment_id: order.payment_id,
      status: order.status,
      subtotal: order.subtotal,
      discount: order.discount ?? 0,
      shipping_cost: order.shipping_cost,
      taxes: order.taxes,
      total: order.total,
      shipping_address_id: order.shipping_address_id,
      user_note: order.user_note,
      admin_notes: order.admin_notes,
      coupon_id: order.coupon_id,
      coupon_discount: order.coupon_discount ?? 0,
      tracking_number: order.tracking_number,
      carrier: order.carrier,
      estimated_delivery_date: order.estimated_delivery_date?.toISOString() ?? null,
      created_at: order.created_at.toISOString(),
      updated_at: order.updated_at?.toISOString() ?? null,
      shipped_at: order.shipped_at?.toISOString() ?? null,
      delivered_at: order.delivered_at?.toISOString() ?? null,
      cancelled_at: order.cancelled_at?.toISOString() ?? null,
      user_id: order.user_id,
      updated_by: order.updated_by,
      customer_name: order.User?.name ?? "N/A",
      customer_email: order.User?.email ?? "N/A",
      payment_method: order.payments.payment_method,
      transaction_id: order.payments.transaction_id,
    }));

    return { data: serializedData };
  } catch (error) {
    
    return { error: `Failed to fetch data for orders.` };
  }
}
