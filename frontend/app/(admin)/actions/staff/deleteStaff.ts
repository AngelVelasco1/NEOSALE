"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { requireAdmin } from "@/lib/auth-helpers";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteStaff(
  staffId: string
): Promise<ServerActionResponse> {
  try {
    await requireAdmin();

    // apiClient automatically injects auth token
    const response = await apiClient.delete(`/users/${staffId}`);

    if (!response.ok) {
      return { success: false, error: "Something went wrong. Could not delete the staff." };
    }

    revalidatePath("/staff");

    return { success: true };
  } catch (error) {
    console.error("[deleteStaff] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the staff." };
  }
}
