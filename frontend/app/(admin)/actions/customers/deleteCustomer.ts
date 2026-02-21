"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteCustomer(
  customerId: string
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.delete(`/admin/customers/${customerId}`);

    if (!response.success) {
      return { success: false, error: response.error || "Something went wrong. Could not delete the customer." };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteCustomer] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the customer." };
  }
}
