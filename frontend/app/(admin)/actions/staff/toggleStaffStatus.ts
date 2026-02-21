"use server";

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { requireAdmin } from "@/lib/auth-helpers";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleStaffPublishedStatus(
  staffId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    await requireAdmin();

    const newPublishedStatus = !currentPublishedStatus;

    // apiClient automatically injects auth token
    const response = await apiClient.put(`/users/${staffId}`, {
      active: newPublishedStatus,
    });

    if (!response.success) {
      return { success: false, error: "Failed to update staff status." };
    }

    revalidatePath("/staff");

    return { success: true };
  } catch (error) {
    console.error("[toggleStaffPublishedStatus] Error:", error);
    return { success: false, error: "Failed to update staff status." };
  }
}
