"use server";

import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  orders: {
    current: number;
    previous: number;
    change: number;
  };
  customers: {
    current: number;
    previous: number;
    change: number;
  };
  products: {
    total: number;
    active: number;
  };
}

export async function getDashboardStats(
  from?: Date | string,
  to?: Date | string
): Promise<DashboardStats> {
  try {
    const params = new URLSearchParams();
    if (from) params.append("from", from instanceof Date ? from.toISOString() : from);
    if (to) params.append("to", to instanceof Date ? to.toISOString() : to);

    const response = await apiClient.get(
      `/admin/dashboard/stats${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success || !response.data?.data) {
      throw new Error(response.error || "Failed to fetch dashboard stats");
    }

    return response.data.data || {
      revenue: { current: 0, previous: 0, change: 0 },
      orders: { current: 0, previous: 0, change: 0 },
      customers: { current: 0, previous: 0, change: 0 },
      products: { total: 0, active: 0 },
    };
  } catch (error) {
    console.error("[getDashboardStats] Error:", error);
    return {
      revenue: { current: 0, previous: 0, change: 0 },
      orders: { current: 0, previous: 0, change: 0 },
      customers: { current: 0, previous: 0, change: 0 },
      products: { total: 0, active: 0 },
    };
  }
}

export async function getOrderStatusStats(): Promise<any> {
  try {
    const response = await apiClient.get(`/admin/dashboard/stats`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch order stats");
    }

    return response.data?.data || {};
  } catch (error) {
    console.error("[getOrderStatusStats] Error:", error);
    return {};
  }
}
