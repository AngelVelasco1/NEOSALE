"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { productBulkFormSchema } from "@/app/(admin)/dashboard/products/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editProducts(
  productIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = productBulkFormSchema.safeParse({
    category:
      formData.get("category") === "" ? undefined : formData.get("category"),
    published:
      formData.get("published") === null
        ? undefined
        : !!(formData.get("published") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { category, published } = parsedData.data;

  try {
    const updateData: any = {};
    if (category) {
      updateData.category_id = parseInt(category);
    }
    if (typeof published !== "undefined") {
      updateData.active = published;
    }

    await prisma.products.updateMany({
      where: { id: { in: productIds.map((id) => parseInt(id)) } },
      data: updateData,
    });

    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
