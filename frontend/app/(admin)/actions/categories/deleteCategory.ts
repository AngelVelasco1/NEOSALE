"use server";

import { apiClient } from "@/lib/api-client";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategory(
  categoryId: string
): Promise<ServerActionResponse> {
  try {
    const response = await apiClient.delete(`/admin/categories/${categoryId}`);

    if (!response.success) {
      return { success: false, error: response.error || "Could not delete the category." };
    }

    return { success: true };
  } catch (error) {
    console.error("[deleteCategory] Error:", error);
    return { success: false, error: "Something went wrong. Could not delete the category." };
  }
}

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Something went wrong. Could not delete the category." };
  }
}
