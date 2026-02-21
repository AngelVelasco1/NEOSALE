import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  handlePrismaError,
} from "../errors/errorsClass.js";

export const getAllBrandsService = async () => {
  try {
    const brands = await prisma.brands.findMany({
      where: {
        active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        active: true,
        _count: {
          select: {
            products: {
              where: {
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

    return brands;
  } catch (error: any) {
    console.error("[getAllBrandsService] Error al obtener todas las marcas:", error);
    throw handlePrismaError(error);
  }
};

export const getBrandByIdService = async (id: number) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de marca inválido");
  }

  try {
    const brand = await prisma.brands.findUnique({
      where: {
        id,
        active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        active: true,
        products: {
          where: {
            active: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: {
              select: {
                id: true,
                image_url: true,
              },
              take: 1,
            },
          },
          take: 50,
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            products: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError("Marca no encontrada");
    }

    return brand;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[getBrandByIdService] Error al obtener marca ${id}:`, error);
    throw handlePrismaError(error);
  }
};

export const getBrandByNameService = async (name: string) => {
  // Validación ANTES del try-catch
  if (!name || !name.trim()) {
    throw new ValidationError("Nombre de marca requerido");
  }

  try {
    const brand = await prisma.brands.findFirst({
      where: {
        name: {
          equals: name.trim(),
          mode: "insensitive",
        },
        active: true,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        image_url: true,
        active: true,
        products: {
          where: {
            active: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: {
              select: {
                id: true,
                image_url: true,
              },
              take: 1,
            },
          },
          take: 50,
          orderBy: {
            created_at: "desc",
          },
        },
        _count: {
          select: {
            products: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    });

    if (!brand) {
      throw new NotFoundError("Marca no encontrada");
    }

    return brand;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(`[getBrandByNameService] Error al obtener marca por nombre "${name}":`, error);
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Brands  
// ============================================

// POST - Create brand
export const createBrandService = async (data: {
  name: string;
  description?: string;
}): Promise<any> => {
  // Validación ANTES del try-catch
  if (!data.name || !data.name.trim()) {
    throw new ValidationError("Nombre de marca es obligatorio");
  }

  try {
    // Check for duplicate (case-insensitive)
    const existing = await prisma.brands.findFirst({
      where: {
        name: { equals: data.name.trim(), mode: "insensitive" },
      },
    });

    if (existing) {
      throw new ValidationError("Una marca con este nombre ya existe");
    }

    const newBrand = await prisma.brands.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        active: true,
      },
    });

    return newBrand;
  } catch (error: any) {
    if (error instanceof ValidationError) throw error;
    console.error("[createBrandService] Error al crear marca:", error);
    throw handlePrismaError(error);
  }
};

// PUT - Toggle brand active status
export const toggleBrandStatusService = async (
  brandId: number,
  active: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!brandId || brandId <= 0) {
    throw new ValidationError("ID de marca inválido");
  }

  try {
    const existing = await prisma.brands.findUnique({
      where: { id: brandId },
    });

    if (!existing) {
      throw new NotFoundError("Marca no encontrada");
    }

    await prisma.brands.update({
      where: { id: brandId },
      data: { active },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(
      `[toggleBrandStatusService] Error al cambiar estado de marca ${brandId}:`,
      error
    );
    throw handlePrismaError(error);
  }
};

// PUT - Edit brand
export const editBrandService = async (
  brandId: number,
  data: { name?: string; description?: string; active?: boolean }
): Promise<any> => {
  // Validación ANTES del try-catch
  if (!brandId || brandId <= 0) {
    throw new ValidationError("ID de marca inválido");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }

  try {
    const existing = await prisma.brands.findUnique({
      where: { id: brandId },
    });

    if (!existing) {
      throw new NotFoundError("Marca no encontrada");
    }

    // Check for duplicate name if changing
    if (data.name && data.name !== existing.name) {
      const duplicateName = await prisma.brands.findFirst({
        where: {
          name: { equals: data.name.trim(), mode: "insensitive" },
          NOT: { id: brandId },
        },
      });

      if (duplicateName) {
        throw new ValidationError("Una marca con este nombre ya existe");
      }
    }

    const updated = await prisma.brands.update({
      where: { id: brandId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && {
          description: data.description?.trim() || null,
        }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });

    return updated;
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[editBrandService] Error al editar marca ${brandId}:`, error);
    throw handlePrismaError(error);
  }
};

// DELETE - Delete brand
export const deleteBrandService = async (brandId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!brandId || brandId <= 0) {
    throw new ValidationError("ID de marca inválido");
  }

  try {
    const existing = await prisma.brands.findUnique({
      where: { id: brandId },
    });

    if (!existing) {
      throw new NotFoundError("Marca no encontrada");
    }

    await prisma.brands.delete({
      where: { id: brandId },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[deleteBrandService] Error al eliminar marca ${brandId}:`, error);
    throw handlePrismaError(error);
  }
};
