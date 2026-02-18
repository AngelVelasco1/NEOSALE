"use server";

import { apiClient } from "@/lib/api-client";

export interface DateRangeParams {
  from?: Date | string;
  to?: Date | string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  productsSold: number;
  productsSoldChange: number;
  avgOrderValue: number;
  conversionRate: number;
  pendingOrders: number;
  activeUsers: number;
}

export async function getDashboardStats(
  dateRange?: DateRangeParams
): Promise<DashboardStats> {
  try {
    const params = new URLSearchParams();
    
    if (dateRange?.from) {
      const fromStr = dateRange.from instanceof Date ? dateRange.from.toISOString() : dateRange.from;
      params.append("from", fromStr);
    }
    
    if (dateRange?.to) {
      const toStr = dateRange.to instanceof Date ? dateRange.to.toISOString() : dateRange.to;
      params.append("to", toStr);
    }

    // Fetch both dashboard stats and order status data
    const [statsResponse, orderStatusResponse] = await Promise.all([
      apiClient.get(
        `/api/admin/dashboard/stats${params.toString() ? `?${params.toString()}` : ""}`
      ),
      apiClient.get(
        `/api/admin/dashboard/order-status${params.toString() ? `?${params.toString()}` : ""}`
      ),
    ]);

    if (!statsResponse.success || !statsResponse.data?.data) {
      throw new Error(statsResponse.error || "Failed to fetch dashboard stats");
    }

    const data = statsResponse.data.data as any;
    const orderStatusData = (orderStatusResponse.data?.data || {}) as any;
    
    const totalRevenue = data.revenue?.current || 0;
    const totalOrders = data.orders?.current || 0;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue,
      revenueChange: data.revenue?.change || 0,
      totalOrders,
      ordersChange: data.orders?.change || 0,
      newCustomers: data.customers?.current || 0,
      customersChange: data.customers?.change || 0,
      productsSold: data.products?.total || 0,
      productsSoldChange: 0,
      avgOrderValue,
      conversionRate: 0, // Placeholder - requires session tracking not available yet
      pendingOrders: orderStatusData.pending || 0,
      activeUsers: data.customers?.current || 0, // Use current customers as proxy for active users
    };
  } catch (error) {
    console.error("[getDashboardStats] Error:", error);
    return {
      totalRevenue: 0,
      revenueChange: 0,
      totalOrders: 0,
      ordersChange: 0,
      newCustomers: 0,
      customersChange: 0,
      productsSold: 0,
      productsSoldChange: 0,
      avgOrderValue: 0,
      conversionRate: 0,
      pendingOrders: 0,
      activeUsers: 0,
    };
  }
}

export async function getOrderStatusStats(dateRange?: DateRangeParams): Promise<any> {
  try {
    const params = new URLSearchParams();
    
    if (dateRange?.from) {
      const fromStr = dateRange.from instanceof Date ? dateRange.from.toISOString() : dateRange.from;
      params.append("from", fromStr);
    }
    
    if (dateRange?.to) {
      const toStr = dateRange.to instanceof Date ? dateRange.to.toISOString() : dateRange.to;
      params.append("to", toStr);
    }

    const response = await apiClient.get(
      `/api/admin/dashboard/order-status${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch order stats");
    }

    return response.data?.data || {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };
  } catch (error) {
    console.error("[getOrderStatusStats] Error:", error);
    return {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };
  }
}
