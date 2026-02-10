"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { categoryFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/app/(admin)/types/server-action";

export async function editCategory(
  categoryId: string,
  formData: FormData
): Promise<CategoryServerActionResponse> {
  const parsedData = categoryFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const categoryData = parsedData.data;

  try {
    const updatedCategory = await prisma.categories.update({
      where: { id: parseInt(categoryId) },
      data: {
        name: categoryData.name,
        description: categoryData.description,
      },
    });

    revalidatePath("/categories");

    return { success: true, category: updatedCategory };
  } catch (error) {
    // Manejar errores de unique constraint de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = error.meta?.target as string[];

        if (target?.includes("name")) {
          return {
            validationErrors: {
              name: "A category with this name already exists. Please enter a unique name for this category.",
            },
          };
        }
      }
    }

    console.error("Database update failed:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
