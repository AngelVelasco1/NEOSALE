"use server";

import { apiClient } from "@/lib/api-client";

export interface DailyData {
  date: string;
  orders: number;
  revenue: number;
}

export async function getChartData(
  from?: Date | string,
  to?: Date | string
): Promise<DailyData[]> {
  try {
    const params = new URLSearchParams();
    if (from) params.append("from", from instanceof Date ? from.toISOString() : from);
    if (to) params.append("to", to instanceof Date ? to.toISOString() : to);

    const response = await apiClient.get(
      `/admin/dashboard/chart-data${params.toString() ? `?${params.toString()}` : ""}`
    );

    if (!response.success || !response.data?.data) {
      throw new Error(response.error || "Failed to fetch chart data");
    }

    return response.data.data || [];
  } catch (error) {
    console.error("[getChartData] Error:", error);
    return [];
  }
}

export async function getCategorySalesData(): Promise<any> {
  try {
    const response = await apiClient.get(`/admin/dashboard/stats`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch category data");
    }

    return response.data?.data || {};
  } catch (error) {
    console.error("[getCategorySalesData] Error:", error);
    return {};
  }
}

export async function getMonthlySalesData(): Promise<any[]> {
  try {
    const response = await apiClient.get(`/admin/dashboard/stats`);

    if (!response.success) {
      throw new Error(response.error || "Failed to fetch monthly data");
    }

    return [];
  } catch (error) {
    console.error("[getMonthlySalesData] Error:", error);
    return [];
  }
}
