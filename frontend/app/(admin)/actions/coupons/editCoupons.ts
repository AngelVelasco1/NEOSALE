"use server";

import { apiClient } from "@/lib/api-client";
import { couponBulkFormSchema } from "@/app/(admin)/dashboard/coupons/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCoupons(
  couponIds: number[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = couponBulkFormSchema.safeParse({
    active: !!(formData.get("active") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { active } = parsedData.data;

  try {
    const response = await apiClient.put(`/admin/coupons`, {
      couponIds,
      active,
    });

    if (!response.success) {
      return { success: false, error: response.error || "Failed to update coupons" };
    }

    return { success: true };
  } catch (error) {
    console.error("[editCoupons] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
