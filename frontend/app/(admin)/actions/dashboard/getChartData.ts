"use server";

import { apiClient } from "@/lib/api-client";

export interface DateRangeParams {
  from?: Date | string;
  to?: Date | string;
}

export interface DailyData {
  date: string;
  orders: number;
  revenue: number;
}

export interface CategorySalesData {
  category: string;
  sales: number;
  orders: number;
}

export interface MonthlySalesData {
  month: string;
  orders: number;
  revenue: number;
  customers: number;
}

export async function getChartData(
  dateRange?: DateRangeParams
): Promise<DailyData[]> {
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
      `/api/admin/dashboard/chart-data${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success || !response.data?.data) {
      throw new Error(response.error || "Failed to fetch chart data");
    }

    const data = response.data.data;
    
    // Transform backend response to match expected interface
    return Array.isArray(data)
      ? data.map((item: any) => ({
          date: item.date ? new Date(item.date).toISOString().split('T')[0] : "",
          orders: Number(item.order_count || item.orders || 0),
          revenue: Number(item.daily_revenue || item.revenue || 0),
        }))
      : [];
  } catch (error) {
    console.error("[getChartData] Error:", error);
    return [];
  }
}

export async function getCategorySalesData(dateRange?: DateRangeParams): Promise<CategorySalesData[]> {
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
      `/api/admin/dashboard/category-sales${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch category data");
    }

    const data = response.data?.data || [];
    
    // Transform backend response to match expected interface
    return Array.isArray(data) 
      ? data.map((item: any) => ({
          category: item.name || "",
          sales: Number(item.revenue || 0),
          orders: Number(item.orders || 0),
        }))
      : [];
  } catch (error) {
    console.error("[getCategorySalesData] Error:", error);
    return [];
  }
}

export async function getMonthlySalesData(dateRange?: DateRangeParams): Promise<MonthlySalesData[]> {
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
      `/api/admin/dashboard/monthly-sales${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch monthly data");
    }

    const data = response.data?.data || [];
    
    // Transform backend response to match expected interface
    return Array.isArray(data)
      ? data.map((item: any) => ({
          month: item.month || "",
          orders: Number(item.orders || 0),
          revenue: Number(item.revenue || 0),
          customers: Number(item.customers || 0),
        }))
      : [];
  } catch (error) {
    console.error("[getMonthlySalesData] Error:", error);
    return [];
  }
}
