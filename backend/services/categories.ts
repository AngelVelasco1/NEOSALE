import { prisma } from "../lib/prisma";

export interface CategoryWithSubcategories {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  subcategories: {
    id: number;
    name: string;
    active: boolean;
  }[];
}

export interface SubcategoryData {
  id: number;
  name: string;
  active: boolean;
}

export class CategoriesService {
  async getAllCategoriesWithSubcategories(): Promise<
    CategoryWithSubcategories[]
  > {
    try {
      const categories = await prisma.categories.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          category_subcategory: {
            where: {
              active: true,
              subcategories: {
                active: true,
              },
            },
            select: {
              subcategories: {
                select: {
                  id: true,
                  name: true,
                  active: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

      const formattedCategories: CategoryWithSubcategories[] = categories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          active: category.active,
          subcategories: category.category_subcategory.map(
            (cs) => cs.subcategories
          ),
        })
      );

      return formattedCategories;
    } catch (error) {
      console.error("Error al obtener las categorías activas:", error);
    }
  }

  async getCategoryById(
    categoryId: number
  ): Promise<CategoryWithSubcategories | null> {
    try {
      const category = await prisma.categories.findUnique({
        where: {
          id: categoryId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          category_subcategory: {
            where: {
              active: true,
              subcategories: {
                active: true,
              },
            },
            select: {
              subcategories: {
                select: {
                  id: true,
                  name: true,
                  active: true,
                },
              },
            },
          },
        },
      });

      if (!category) {
        return null;
      }

      const formattedCategory: CategoryWithSubcategories = {
        id: category.id,
        name: category.name,
        description: category.description,
        active: category.active,
        subcategories: category.category_subcategory.map(
          (cs) => cs.subcategories
        ),
      };

      return formattedCategory;
    } catch (error) {
      console.error("Error al obtener la categoría por ID:", error);
    }
  }

  async getSubcategoriesByCategory(
    categoryId: number
  ): Promise<SubcategoryData[]> {
    try {
      const categorySubcategories = await prisma.category_subcategory.findMany({
        where: {
          category_id: categoryId,
          active: true,
          subcategories: {
            active: true,
          },
        },
        select: {
          subcategories: {
            select: {
              id: true,
              name: true,
              active: true,
            },
          },
        },
        orderBy: {
          subcategories: {
            name: "asc",
          },
        },
      });

      return categorySubcategories.map((cs) => cs.subcategories);
    } catch (error) {
      console.error("Error al obtener las subcategorías por categoría:", error);
    }
  }

  async getActiveCategoriesOnly(): Promise<
    { id: number; name: string; description: string | null }[]
  > {
    try {
      const categories = await prisma.categories.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return categories;
    } catch (error) {
      console.error("Error al obtener las categorías activas:", error);
    }
  }

  async getCategoryProductsCount(categoryId: number): Promise<number> {
    try {
      const count = await prisma.products.count({
        where: {
          category_id: categoryId,
          active: true,
        },
      });

      return count;
    } catch (error) {
      console.error("Error al contar productos de la categoría:", error);
    }
  }

  async getSubcategoryProductsCount(subcategoryId: number): Promise<number> {
    try {
      // Obtener las categorías que tienen esta subcategoría
      const categorySubcategories = await prisma.category_subcategory.findMany({
        where: {
          subcategory_id: subcategoryId,
          active: true,
        },
        select: {
          category_id: true,
        },
      });

      const categoryIds = categorySubcategories.map((cs) => cs.category_id);

      const count = await prisma.products.count({
        where: {
          category_id: {
            in: categoryIds,
          },
          active: true,
        },
      });

      return count;
    } catch (error) {
      console.error("Error al contar productos de la subcategoría:", error);
    }
  }
}
