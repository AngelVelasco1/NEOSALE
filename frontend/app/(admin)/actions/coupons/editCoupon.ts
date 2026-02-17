"use server";

import { apiClient } from "@/lib/api-client";
import { couponFormSchema } from "@/app/(admin)/dashboard/coupons/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CouponServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCoupon(
  couponId: number,
  formData: FormData
): Promise<CouponServerActionResponse> {
  const parsedData = couponFormSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    expiresAt: formData.get("expiresAt"),
    isPercentageDiscount: formData.get("isPercentageDiscount") === "true",
    discountValue: formData.get("discountValue"),
    minPurchaseAmount: formData.get("minPurchaseAmount"),
    usageLimit: formData.get("usageLimit"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  try {
    const response = await apiClient.put(`/admin/coupons/${couponId}`, {
      code: parsedData.data.code,
      name: parsedData.data.name,
      discount_type: parsedData.data.isPercentageDiscount ? "percentage" : "fixed",
      discount_value: parsedData.data.discountValue,
      min_purchase_amount: parsedData.data.minPurchaseAmount || 0,
      usage_limit: parsedData.data.usageLimit || null,
      expires_at: parsedData.data.expiresAt,
    });

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to update coupon" };
    }

    return { success: true, coupon: response.data };
  } catch (error) {
    console.error("[editCoupon] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}

    return { success: true, coupon: updatedCoupon };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];

        if (target?.includes("code")) {
          return {
            validationErrors: {
              code: "This coupon code is already in use. Please create a unique code for your new coupon.",
            },
          };
        }
      }
    }

    
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
