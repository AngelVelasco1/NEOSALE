"use server";

import { apiClient } from "@/lib/api-client";
import { categoryFormSchema } from "@/app/(admin)/dashboard/categories/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/app/(admin)/types/server-action";
import { z } from "zod";

export async function addCategory(
  formData: FormData
): Promise<CategoryServerActionResponse> {
  try {
    const parsedData = categoryFormSchema
      .extend({
        subcategories: z.string().optional(),
      })
      .safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        subcategories: formData.get("subcategories"),
      });

    if (!parsedData.success) {
      return {
        validationErrors: formatValidationErrors(
          parsedData.error.flatten().fieldErrors
        ),
      };
    }

    const response = await apiClient.post(`/admin/categories`, {
      name: parsedData.data.name,
      description: parsedData.data.description,
    });

    if (!response.success) {
      if (response.validationErrors) {
        return { validationErrors: response.validationErrors };
      }
      return { success: false, error: response.error || "Failed to create category" };
    }

    return { success: true, category: response.data };
  } catch (error) {
    console.error("[addCategory] Error:", error);
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}

      if (subcategoryNames.length > 0) {
        const subcategoryIds: number[] = [];
        
        // Create or find each subcategory
        for (const subcategoryName of subcategoryNames) {
          // Try to find existing subcategory
          let subcategory = await prisma.subcategories.findFirst({
            where: { name: subcategoryName },
          });

          // If doesn't exist, create it
          if (!subcategory) {
            subcategory = await prisma.subcategories.create({
              data: {
                name: subcategoryName,
                active: true,
              },
            });
          }

          subcategoryIds.push(subcategory.id);
        }

        // Create relationships in category_subcategory table
        const relationshipData = subcategoryIds.map((subcategoryId) => ({
          category_id: newCategory.id,
          subcategory_id: subcategoryId,
          active: true,
        }));

        await prisma.category_subcategory.createMany({
          data: relationshipData,
          skipDuplicates: true, // Skip if relationship already exists
        });
      }
    }

    revalidatePath("/dashboard/categories");

    return { 
      success: true, 
      category: { ...newCategory, subcategory: null } 
    };
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

    
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}
