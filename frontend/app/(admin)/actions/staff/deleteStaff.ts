"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/(auth)/auth";
import { ServerActionResponse } from "@/app/(admin)/types/server-action";

export async function deleteStaff(
  staffId: string
): Promise<ServerActionResponse> {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "admin") {
      return { success: false, error: "No autorizado" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/${staffId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.user?.id}`,
        },
      }
    );

    if (!response.ok) {
      return { success: false, error: "Something went wrong. Could not delete the staff." };
    }

    revalidatePath("/staff");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Something went wrong. Could not delete the staff." };
  }
}
