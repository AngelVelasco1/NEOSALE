"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/prisma/generated/prisma/client";

import { prisma } from "@/lib/prisma";
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
    const updatedCoupon = await prisma.coupons.update({
      where: { id: couponId },
      data: {
        code: parsedData.data.code,
        name: parsedData.data.name,
        discount_type: parsedData.data.isPercentageDiscount
          ? "percentage"
          : "fixed",
        discount_value: parsedData.data.discountValue,
        min_purchase_amount: parsedData.data.minPurchaseAmount || 0,
        usage_limit: parsedData.data.usageLimit || null,
        expires_at: parsedData.data.expiresAt,
      },
    });

    revalidatePath("/coupons");

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
