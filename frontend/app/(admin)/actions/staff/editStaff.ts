"use server";

import { apiClient } from "@/lib/api-client";
import { requireAdmin } from "@/lib/auth-helpers";
import { staffFormSchema } from "@/app/(admin)/dashboard/staff/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { StaffServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editStaff(
  staffId: string,
  formData: FormData
): Promise<StaffServerActionResponse> {
  await requireAdmin();

  const parsedData = staffFormSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    image: formData.get("image"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  try {
    const response = await apiClient.uploadFile(
      `/api/admin/staff/${staffId}`,
      formData
    );

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to update staff" };
    }

    return { success: true, staff: response.data };
  } catch (error) {
    console.error("[editStaff] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
