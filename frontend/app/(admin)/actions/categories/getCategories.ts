"use server";

import { prisma } from "@/lib/prisma";

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type CategoryWithSubcategories = {
  id: number;
  name: string;
  subcategories: {
    id: number;
    name: string;
  }[];
};

export type SubcategoryItem = {
  id: number;
  name: string;
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
          // No filtrar por active: true para permitir ver categorías inactivas en admin
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
      prisma.categories.count({
        where: {
          ...where,
          // No filtrar por active: true en el conteo para admin
        },
      }),
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

export async function getSubcategoriesDropdown() {
  try {
    const subcategories = await prisma.subcategories.findMany({
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

    return subcategories;
  } catch (error) {
    console.error("Error fetching subcategories dropdown:", error);
    throw new Error("Failed to fetch subcategories dropdown");
  }
}

export async function getSubcategoriesByCategoryDropdown(categoryId?: number) {
  try {
    if (!categoryId) {
      // If no category is selected, return all subcategories
      return getSubcategoriesDropdown();
    }

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
    console.error("Error fetching subcategories by category dropdown:", error);
    throw new Error("Failed to fetch subcategories by category dropdown");
  }
}

export async function getCategoriesWithSubcategories() {
  try {
    const categories = await prisma.categories.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        category_subcategory: {
          where: {
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
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      subcategories: category.category_subcategory.map(
        (cs) => cs.subcategories
      ),
    }));
  } catch (error) {
    console.error("Error fetching categories with subcategories:", error);
    throw new Error("Failed to fetch categories with subcategories");
  }
}
