"use server";

import { apiClient } from "@/lib/api-client";

export async function exportOrders() {
  try {
    const response = await apiClient.get(`/admin/orders/export`);

    if (!response.success) {
      return { error: response.error || "Failed to fetch data for orders." };
    }

    return { data: response.data || [] };
  } catch (error) {
    console.error("[exportOrders] Error:", error);
    return { error: "Failed to fetch data for orders." };
  }
}
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
