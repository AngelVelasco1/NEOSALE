"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/(auth)/auth";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function toggleStaffPublishedStatus(
  staffId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "No autorizado" };
    }

    const newPublishedStatus = !currentPublishedStatus;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${staffId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.id}`,
        },
        body: JSON.stringify({ active: newPublishedStatus }),
      }
    );

    if (!response.ok) {
      return { success: false, error: "Failed to update staff status." };
    }

    revalidatePath("/staff");

    return { success: true };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, error: "Failed to update staff status." };
  }
}
