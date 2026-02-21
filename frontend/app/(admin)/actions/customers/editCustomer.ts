"use server";

import { apiClient } from "@/lib/api-client";
import { customerFormSchema } from "@/app/(admin)/dashboard/customers/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CustomerServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCustomer(
  customerId: string,
  formData: FormData
): Promise<CustomerServerActionResponse> {
  const parsedData = customerFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const customerData = parsedData.data;

  try {
    const response = await apiClient.put(`/api/admin/customers/${customerId}`, customerData);

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to update customer" };
    }

    return { success: true, customer: response.data };
  } catch (error) {
    console.error("[editCustomer] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
