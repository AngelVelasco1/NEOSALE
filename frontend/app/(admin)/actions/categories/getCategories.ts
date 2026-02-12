"use server";

import { prisma } from "@/lib/prisma";

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
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
  sortBy,
  sortOrder,
  status,
}: GetCategoriesParams = {}) {
  try {
    const where: any = {};

    // Filtro por búsqueda
    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive" as const,
      };
    }

    // Filtro por estado
    if (status && status !== "all") {
      where.active = status === "active";
    }

    // Construir orderBy dinámico
    let orderBy: any = { id: "desc" }; // default
    if (sortBy && sortOrder) {
      orderBy = { [sortBy]: sortOrder };
    }

    const [data, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
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
        where,
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
    
    throw new Error("Failed to fetch categories with subcategories");
  }
}
