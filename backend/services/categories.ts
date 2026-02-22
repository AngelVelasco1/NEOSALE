import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  DuplicateError,
  handlePrismaError,
} from "../errors/errorsClass.js";

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

export interface CreateCategoryData {
  name: string;
  description?: string;
  subcategories?: number[];
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  active?: boolean;
}

export interface SubcategoryData {
  id: number;
  name: string;
  active: boolean;
}

// ✅ GET - Obtener todas las categorías con subcategorías
export const getAllCategoriesWithSubcategoriesService = async (): Promise<
  CategoryWithSubcategories[]
> => {
  try {
    const categories = await prisma.categories.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        category_subcategory: {
          where: {
            active: true,
            subcategories: { active: true },
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
      orderBy: { name: "asc" },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      active: category.active,
      subcategories: category.category_subcategory.map(
        (cs) => cs.subcategories
      ),
    }));
  } catch (error: any) {
    console.error("[getAllCategoriesWithSubcategoriesService] Error:", error);
    throw handlePrismaError(error);
  }
};

// ✅ GET - Obtener categoría por ID
export const getCategoryByIdService = async (
  categoryId: number
): Promise<CategoryWithSubcategories> => {
  if (!categoryId || categoryId <= 0) {
    throw new ValidationError("ID de categoría inválido");
  }

  try {
    const category = await prisma.categories.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        category_subcategory: {
          where: {
            active: true,
            subcategories: { active: true },
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
      throw new NotFoundError("Categoría no encontrada");
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      active: category.active,
      subcategories: category.category_subcategory.map(
        (cs) => cs.subcategories
      ),
    };
  } catch (error: any) {
    if (error instanceof NotFoundError) throw error;
    console.error(`[getCategoryByIdService] Error al obtener categoría ${categoryId}:`, error);
    throw handlePrismaError(error);
  }
};

// ✅ CREATE - Crear categoría con subcategorías
export const createCategoryService = async (
  data: CreateCategoryData
): Promise<CategoryWithSubcategories> => {
  if (!data.name || !data.name.trim()) {
    throw new ValidationError("Nombre de categoría es obligatorio");
  }
  if (data.description && data.description.trim().length > 500) {
    throw new ValidationError("La descripción no puede exceder 500 caracteres");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Verificar si la categoría ya existe
      const existingCategory = await tx.categories.findFirst({
        where: {
          name: data.name.trim(),
        },
      });

      if (existingCategory) {
        throw new DuplicateError("Una categoría con este nombre ya existe");
      }

      // Crear la categoría
      const newCategory = await tx.categories.create({
        data: {
          name: data.name.trim(),
          description: data.description?.trim() || null,
          active: true,
        },
      });

      // Crear relaciones con subcategorías si se proporcionan
      if (data.subcategories && data.subcategories.length > 0) {
        const subcategoryIds = [...new Set(data.subcategories)]; // Remover duplicados

        // Validar que todas las subcategorías existan
        const subcategories = await tx.subcategories.findMany({
          where: { id: { in: subcategoryIds } },
          select: { id: true },
        });

        if (subcategories.length !== subcategoryIds.length) {
          throw new NotFoundError("Una o más subcategorías no existen");
        }

        // Crear relaciones
        await tx.category_subcategory.createMany({
          data: subcategoryIds.map((subcategoryId) => ({
            category_id: newCategory.id,
            subcategory_id: subcategoryId,
            active: true,
          })),
          skipDuplicates: true,
        });
      }

      // Retornar categoría con subcategorías
      const createdCategory = await tx.categories.findUnique({
        where: { id: newCategory.id },
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          category_subcategory: {
            where: { active: true },
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

      return {
        id: createdCategory!.id,
        name: createdCategory!.name,
        description: createdCategory!.description,
        active: createdCategory!.active,
        subcategories: createdCategory!.category_subcategory.map(
          (cs) => cs.subcategories
        ),
      };
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof DuplicateError || error instanceof NotFoundError) {
      throw error;
    }
    console.error("[createCategoryService] Error al crear categoría:", error);
    throw handlePrismaError(error);
  }
};

// ✅ UPDATE - Actualizar categoría
export const updateCategoryService = async (
  categoryId: number,
  data: UpdateCategoryData
): Promise<CategoryWithSubcategories> => {
  if (!categoryId || categoryId <= 0) {
    throw new ValidationError("ID de categoría inválido");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }
  if (data.name && !data.name.trim()) {
    throw new ValidationError("El nombre de categoría no puede estar vacío");
  }
  if (data.description && data.description.trim().length > 500) {
    throw new ValidationError("La descripción no puede exceder 500 caracteres");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Verificar que la categoría existe
      const existingCategory = await tx.categories.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        throw new NotFoundError("Categoría no encontrada");
      }

      // Verificar unicidad del nombre si se actualiza
      if (data.name && data.name.trim() !== existingCategory.name) {
        const duplicate = await tx.categories.findFirst({
          where: {
            name: data.name.trim(),
            id: { not: categoryId },
          },
        });

        if (duplicate) {
          throw new DuplicateError("Una categoría con este nombre ya existe");
        }
      }

      // Actualizar la categoría
      await tx.categories.update({
        where: { id: categoryId },
        data: {
          ...(data.name && { name: data.name.trim() }),
          ...(data.description !== undefined && {
            description: data.description?.trim() || null,
          }),
          ...(data.active !== undefined && { active: data.active }),
        },
      });

      // Retornar categoría actualizada
      const updatedCategory = await tx.categories.findUnique({
        where: { id: categoryId },
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          category_subcategory: {
            where: { active: true },
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

      return {
        id: updatedCategory!.id,
        name: updatedCategory!.name,
        description: updatedCategory!.description,
        active: updatedCategory!.active,
        subcategories: updatedCategory!.category_subcategory.map(
          (cs) => cs.subcategories
        ),
      };
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError || error instanceof DuplicateError) {
      throw error;
    }
    console.error(`[updateCategoryService] Error al actualizar categoría ${categoryId}:`, error);
    throw handlePrismaError(error);
  }
};

// ✅ DELETE - Eliminar categoría (soft delete)
export const deleteCategoryService = async (categoryId: number): Promise<void> => {
  if (!categoryId || categoryId <= 0) {
    throw new ValidationError("ID de categoría inválido");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Verificar que la categoría existe
      const category = await tx.categories.findUnique({
        where: { id: categoryId },
        include: { products: { select: { id: true } } },
      });

      if (!category) {
        throw new NotFoundError("Categoría no encontrada");
      }

      // Verificar que no hay productos activos en la categoría
      if (category.products.length > 0) {
        throw new ValidationError(
          "No se puede eliminar una categoría que tiene productos asignados"
        );
      }

      // Soft delete: marcar como inactiva
      await tx.categories.update({
        where: { id: categoryId },
        data: { active: false },
      });

      // También desactivar sus subcategorías
      await tx.category_subcategory.updateMany({
        where: { category_id: categoryId },
        data: { active: false },
      });
    }) as void;
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[deleteCategoryService] Error al eliminar categoría ${categoryId}:`, error);
    throw handlePrismaError(error);
  }
};

// ✅ GET - Obtener subcategorías de una categoría
export const getSubcategoriesByCategoryService = async (
  categoryId: number
): Promise<SubcategoryData[]> => {
  if (!categoryId || categoryId <= 0) {
    throw new ValidationError("ID de categoría inválido");
  }

  try {
    const categorySubcategories = await prisma.category_subcategory.findMany({
      where: {
        category_id: categoryId,
        active: true,
        subcategories: { active: true },
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
        subcategories: { name: "asc" },
      },
    });

    return categorySubcategories.map((cs) => cs.subcategories);
  } catch (error: any) {
    console.error(
      `[getSubcategoriesByCategoryService] Error al obtener subcategorías para categoría ${categoryId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// ✅ GET - Obtener solo categorías activas (simple)
export const getActiveCategoriesService = async (): Promise<
  { id: number; name: string; description: string | null }[]
> => {
  try {
    return await prisma.categories.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
      orderBy: { name: "asc" },
    });
  } catch (error: any) {
    console.error("[getActiveCategoriesService] Error:", error);
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Categories
// ============================================

interface AdminCategoriesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "created_at";
  sortOrder?: "asc" | "desc";
  status?: "active" | "inactive";
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getPaginationParams = (page?: number, limit?: number) => {
  const safeLimit = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
  const safePage = Math.max(page || 1, 1);
  return { skip: (safePage - 1) * safeLimit, take: safeLimit, limit: safeLimit };
};

// GET - Admin Categories List (with filtering and pagination)
export const getCategoriesAdminService = async (params: AdminCategoriesQueryParams) => {
  // Validación ANTES del try-catch
  if (params.search && !params.search.trim()) {
    throw new ValidationError("Búsqueda inválida");
  }

  const { skip, take, limit } = getPaginationParams(params.page, params.limit);
  const sortOrder = params.sortOrder || "desc";

  try {
    // Build where clause
    const where: any = {};

    // Search by name
    if (params.search?.trim()) {
      where.name = { contains: params.search.trim(), mode: "insensitive" };
    }

    // Filter by active status
    if (params.status === "active") {
      where.active = true;
    } else if (params.status === "inactive") {
      where.active = false;
    }

    // Determine sort order
    let orderBy: any = { id: sortOrder };
    if (params.sortBy) {
      orderBy = { [params.sortBy]: sortOrder };
    }

    // Execute query with count
    const [categories, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          category_subcategory: {
            where: { active: true },
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
          _count: {
            select: { products: true },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.categories.count({ where }),
    ]);

    return {
      success: true,
      data: categories.map((c) => ({
        ...c,
        subcategories: c.category_subcategory.map((cs) => cs.subcategories),
      })),
      pagination: {
        total,
        page: params.page || 1,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    if (error instanceof ValidationError) throw error;
    console.error("[getCategoriesAdminService] Error al obtener categorías:", error);
    throw handlePrismaError(error);
  }
};

// PUT - Toggle category active/published status
export const toggleCategoryStatusService = async (
  categoryId: number,
  active: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!categoryId || categoryId <= 0) {
    throw new ValidationError("ID de categoría inválido");
  }

  try {
    const existing = await prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!existing) {
      throw new NotFoundError("Categoría no encontrada");
    }

    await prisma.categories.update({
      where: { id: categoryId },
      data: { active },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[toggleCategoryStatusService] Error al cambiar estado de categoría ${categoryId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// PUT - Bulk edit categories (active status)
export const editCategoriesService = async (
  categoryIds: number[],
  data: { active?: boolean }
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!categoryIds || categoryIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de categoría");
  }
  if (categoryIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de categoría deben ser válidos");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }

  try {
    // Check if all categories exist
    const existingCount = await prisma.categories.count({
      where: { id: { in: categoryIds } },
    });

    if (existingCount !== categoryIds.length) {
      throw new NotFoundError("Una o más categorías no fueron encontradas");
    }

    // Update all categories
    await prisma.categories.updateMany({
      where: { id: { in: categoryIds } },
      data: {
        ...(data.active !== undefined && { active: data.active }),
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[editCategoriesService] Error al editar categorías:", error);
    throw handlePrismaError(error);
  }
};

// DELETE - Bulk delete categories
export const deleteCategoriesService = async (categoryIds: number[]): Promise<void> => {
  // Validación ANTES del try-catch
  if (!categoryIds || categoryIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de categoría");
  }
  if (categoryIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de categoría deben ser válidos");
  }

  try {
    // Check if all categories exist
    const existingCount = await prisma.categories.count({
      where: { id: { in: categoryIds } },
    });

    if (existingCount !== categoryIds.length) {
      throw new NotFoundError("Una o más categorías no fueron encontradas");
    }

    // Delete categories (cascade will handle relations)
    await prisma.categories.deleteMany({
      where: { id: { in: categoryIds } },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[deleteCategoriesService] Error al eliminar categorías:", error);
    throw handlePrismaError(error);
  }
};

// GET - Export all categories for CSV/Excel
export const exportCategoriesService = async (): Promise<any[]> => {
  try {
    const categories = await prisma.categories.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        products: true,
      },
      orderBy: { name: "asc" },
    });

    // Format for export
    return categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      active: c.active,
      productCount: c.products?.length || 0,
    }));
  } catch (error: any) {
    console.error("[exportCategoriesService] Error al exportar categorías:", error);
    throw handlePrismaError(error);
  }
};
