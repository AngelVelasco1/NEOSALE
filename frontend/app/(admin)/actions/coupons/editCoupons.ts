"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { couponBulkFormSchema } from "@/app/(admin)/dashboard/coupons/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCoupons(
  couponIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = couponBulkFormSchema.safeParse({
    published: !!(formData.get("published") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { published } = parsedData.data;

  try {
    await prisma.coupons.updateMany({
      where: { id: { in: couponIds.map((id) => parseInt(id)) } },
      data: { active: published },
    });

    revalidatePath("/coupons");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Something went wrong. Please try again later." };
  }
}
