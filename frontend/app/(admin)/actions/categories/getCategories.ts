"use server";

import { prisma } from "@/lib/prisma";

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export async function getCategories({
  page = 1,
  limit = 10,
  search,
}: GetCategoriesParams = {}) {
  try {
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.categories.findMany({
        where: {
          ...where,
          active: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: "desc",
        },
        include: {
          subcategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.categories.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoriesDropdown() {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories;
  } catch (error) {
    console.error("Error fetching categories dropdown:", error);
    throw new Error("Failed to fetch categories dropdown");
  }
}

export async function getSubcategoriesByCategory(categoryId: number) {
  try {
    const subcategories = await prisma.category_subcategory.findMany({
      where: {
        category_id: categoryId,
        active: true,
      },
      include: {
        subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return subcategories.map((cs) => cs.subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw new Error("Failed to fetch subcategories");
  }
}

export async function getCategoryById(categoryId: number) {
  try {
    const category = await prisma.categories.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        subcategory: true,
        category_subcategory: {
          include: {
            subcategories: true,
          },
        },
      },
    });

    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw new Error("Failed to fetch category");
  }
}
