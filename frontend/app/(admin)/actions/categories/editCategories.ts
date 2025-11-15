"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { categoryBulkFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCategories(
  categoryIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = categoryBulkFormSchema.safeParse({
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
    await prisma.categories.updateMany({
      where: { id: { in: categoryIds.map((id) => parseInt(id)) } },
      data: { active: published },
    });

    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    console.error("Database update failed:", error);
    return { dbError: "Something went wrong. Please try again later." };
  }
}
