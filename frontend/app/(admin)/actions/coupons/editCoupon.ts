"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { couponFormSchema } from "@/app/(dashboard)/coupons/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CouponServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCoupon(
  couponId: string,
  formData: FormData
): Promise<CouponServerActionResponse> {
  const parsedData = couponFormSchema.safeParse({
    name: formData.get("name"),
    code: formData.get("code"),
    image: formData.get("image"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    isPercentageDiscount: formData.get("isPercentageDiscount") === "true",
    discountValue: formData.get("discountValue"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...couponData } = parsedData.data;

  let imageUrl: string | undefined;

  // TODO: Implementar upload de imagen con Cloudinary
  if (image instanceof File && image.size > 0) {
    // Por ahora, guardamos el nombre del archivo
    // Implementa tu solución de storage preferida aquí (Cloudinary, etc.)
    imageUrl = `/uploads/coupons/${image.name}`;
  }

  try {
    const updatedCoupon = await prisma.coupons.update({
      where: { id: parseInt(couponId) },
      data: {
        name: couponData.name,
        code: couponData.code,
        expires_at: couponData.endDate,
        discount_type: couponData.isPercentageDiscount ? "percentage" : "fixed",
        discount_value: couponData.discountValue,
        // created_at: couponData.startDate, // TODO: Ajustar según necesites
        // ...(imageUrl && { image_url: imageUrl }), // TODO: Descomentar cuando agregues el campo
      },
    });

    revalidatePath("/coupons");

    return { success: true, coupon: updatedCoupon };
  } catch (error) {
    // Manejar errores de unique constraint de Prisma
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

    console.error("Database update failed:", error);
    return { dbError: "Something went wrong. Please try again later." };
  }
}
