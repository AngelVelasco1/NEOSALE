import { prisma } from "../lib/prisma.js";
import {
  ValidationError,
  NotFoundError,
  handlePrismaError,
} from "../errors/errorsClass.js";

interface PaginationParams {
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const getPaginationParams = (page?: number, limit?: number) => {
  const safeLimit = Math.min(limit || DEFAULT_LIMIT, MAX_LIMIT);
  const safePage = Math.max(page || 1, 1);
  return { skip: (safePage - 1) * safeLimit, take: safeLimit };
};

// Proyección optimizada para listados (sin includes anidados)
const productListSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  sizes: true,
  base_discount: true,
  category_id: true,
  brand_id: true,
  images: {
    select: {
      image_url: true,
      color_code: true,
      color: true,
    },
  },
  categories: {
    select: {
      name: true,
    },
  },
};

// Proyección completa para detalle
const productDetailSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  sizes: true,
  base_discount: true,
  in_offer: true,
  offer_start_date: true,
  offer_end_date: true,
  offer_discount: true,
  active: true,
  images: true,
  categories: {
    select: {
      id: true,
      name: true,
    },
  },
};

const formatProductForList = (p: any) => {

  // Sacar imágenes únicas por color_code
  const uniqueImages = p.images || [];


  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    sizes: p.sizes,
    discount: p.base_discount,
    image_url: uniqueImages[0]?.image_url,
    color_code: uniqueImages[0]?.color_code,
    color: uniqueImages[0]?.color,
    category: p.categories?.name,
    images: uniqueImages.map((img: any) => ({
      image_url: img.image_url,
      color: img.color,
      color_code: img.color_code,
    })),
  };
};

export const getProductsService = async (
  id?: number,
  category?: string,
  subcategory?: string,
  paginationParams?: PaginationParams
) => {
  // Validación ANTES del try-catch
  if (id && id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (category && !category.trim()) {
    throw new ValidationError("Nombre de categoría inválido");
  }
  if (subcategory && !subcategory.trim()) {
    throw new ValidationError("Nombre de subcategoría inválido");
  }

  const { skip, take } = getPaginationParams(
    paginationParams?.page,
    paginationParams?.limit
  );

  try {
    if (!id) {
      if (subcategory) {
        const products = await prisma.products.findMany({
          where: {
            active: true,
            categories: {
              category_subcategory: {
                some: {
                  subcategories: {
                    name: {
                      equals: subcategory.trim(),
                      mode: "insensitive",
                    },
                  },
                },
              },
            },
          },
          select: productListSelect,
          skip,
          take,
          orderBy: { created_at: "desc" },
        });

        return products.map(formatProductForList);
      } else if (category) {
        const products = await prisma.products.findMany({
          where: {
            active: true,
            categories: {
              name: {
                equals: category.trim(),
                mode: "insensitive",
              },
            },
          },
          select: productListSelect,
          skip,
          take,
          orderBy: { created_at: "desc" },
        });

        return products.map(formatProductForList);
      }

      // Listado general con paginación
      const products = await prisma.products.findMany({
        where: { active: true },
        select: productListSelect,
        skip,
        take,
        orderBy: { created_at: "desc" },
      });

      return products.map(formatProductForList);
    }

    // Detalle del producto
    const product = await prisma.products.findUnique({
      where: { id },
      select: productDetailSelect,
    });

    if (!product) {
      throw new NotFoundError("Producto no encontrado");
    }

    return product;
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error(
      `[getProductsService] Error al obtener productos (id: ${id}, category: ${category}, subcategory: ${subcategory}):`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const getLatestProductsService = async () => {
  try {
    const products = await prisma.products.findMany({
      where: { active: true },
      select: productListSelect,
      orderBy: { created_at: "desc" },
      take: 8,
    });

    return products.map(formatProductForList);
  } catch (error: any) {
    console.error("[getLatestProductsService] Error al obtener productos más recientes:", error);
    throw handlePrismaError(error);
  }
};

export const getVariantStockService = async (
  id: number,
  color_code: string,
  size: string
) => {
  // Validación ANTES del try-catch
  if (!id || id <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (!color_code || !color_code.trim()) {
    throw new ValidationError("Código de color requerido");
  }
  if (!size || !size.trim()) {
    throw new ValidationError("Talla requerida");
  }

  try {
    const variant = await prisma.product_variants.findFirst({
      where: {
        product_id: id,
        color_code: color_code.trim(),
        size: size.trim(),
      },
      select: {
        product_id: true,
        stock: true,
        sku: true,
      },
    });

    return {
      stock: variant?.stock || 0,
      sku: variant?.sku || null,
      isAvailable: (variant?.stock || 0) > 0,
    };
  } catch (error: any) {
    console.error(
      `[getVariantStockService] Error al obtener stock de variante (producto: ${id}, color: ${color_code}, talla: ${size}):`,
      error
    );
    throw handlePrismaError(error);
  }
};

export const getOffersService = async (paginationParams?: PaginationParams) => {
  const { skip, take } = getPaginationParams(
    paginationParams?.page,
    paginationParams?.limit
  );
  const currentDate = new Date();

  try {
    const offers = await prisma.products.findMany({
      where: {
        active: true,
        in_offer: true,
        offer_start_date: {
          lte: currentDate,
        },
        offer_end_date: {
          gte: currentDate,
        },
      },
      select: {
        ...productListSelect,
        offer_discount: true,
        offer_end_date: true,
      },
      orderBy: {
        offer_discount: "desc",
      },
      skip,
      take,
    });

    return offers.map((p) => ({
      ...formatProductForList(p),
      discount: p.offer_discount,
      endDate: p.offer_end_date,
    }));
  } catch (error: any) {
    console.error("[getOffersService] Error al obtener ofertas:", error);
    throw handlePrismaError(error);
  }
};

// ✅ CREATE - Crear producto
export const createProductService = async (data: {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  sizes?: string[];
  base_discount?: number;
  category_id?: number;
  active?: boolean;
}): Promise<any> => {
  // Validación ANTES del try-catch
  if (!data.name || !data.name.trim()) {
    throw new ValidationError("Nombre de producto es obligatorio");
  }
  if (!data.price || data.price <= 0) {
    throw new ValidationError("Precio debe ser mayor a 0");
  }
  if (data.base_discount && (data.base_discount < 0 || data.base_discount > 100)) {
    throw new ValidationError("Descuento debe estar entre 0 y 100");
  }

  try {
    const newProduct = await prisma.products.create({
      data: {
        name: data.name.trim(),
        price: data.price,
        stock: data.stock ?? 0,
        base_discount: data.base_discount ?? 0,
        active: data.active ?? true,
      },
      select: productDetailSelect,
    });

    return newProduct;
  } catch (error: any) {
    if (error instanceof ValidationError) throw error;
    console.error("[createProductService] Error al crear producto:", error);
    throw handlePrismaError(error);
  }
};

// ✅ UPDATE - Actualizar producto
export const updateProductService = async (
  productId: number,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    sizes: string[];
    base_discount: number;
    category_id: number;
    active: boolean;
    in_offer: boolean;
    offer_discount: number;
    offer_start_date: Date;
    offer_end_date: Date;
  }>
): Promise<any> => {
  // Validación ANTES del try-catch
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }
  if (data.price && data.price <= 0) {
    throw new ValidationError("Precio debe ser mayor a 0");
  }
  if (data.base_discount && (data.base_discount < 0 || data.base_discount > 100)) {
    throw new ValidationError("Descuento debe estar entre 0 y 100");
  }

  try {
    // Verificar que el producto existe
    const existing = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!existing) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Actualizar
    const updated = await prisma.products.update({
      where: { id: productId },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.description !== undefined && {
          description: data.description ? data.description.trim() : undefined,
        }),
        ...(data.price && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.sizes && { sizes: data.sizes }),
        ...(data.base_discount !== undefined && { base_discount: data.base_discount }),
        ...(data.active !== undefined && { active: data.active }),
        ...(data.in_offer !== undefined && { in_offer: data.in_offer }),
        ...(data.offer_discount && { offer_discount: data.offer_discount }),
        ...(data.offer_start_date && { offer_start_date: data.offer_start_date }),
        ...(data.offer_end_date && { offer_end_date: data.offer_end_date }),
      },
      select: productDetailSelect,
    });

    return updated;
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[updateProductService] Error al actualizar producto ${productId}:`, error);
    throw handlePrismaError(error);
  }
};

// ✅ DELETE - Eliminar producto (soft delete / deactivate)
export const deleteProductService = async (productId: number): Promise<void> => {
  // Validación ANTES del try-catch
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    // Verificar que el producto existe
    const existing = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!existing) {
      throw new NotFoundError("Producto no encontrado");
    }

    // Soft delete: deactivate
    await prisma.products.update({
      where: { id: productId },
      data: { active: false },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[deleteProductService] Error al eliminar producto ${productId}:`, error);
    throw handlePrismaError(error);
  }
};

// ============================================
// ADMIN FUNCTIONS - Products
// ============================================

interface AdminProductsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  subcategory?: string;
  brand?: string;
  active?: boolean;
  inOffer?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "inStock" | "lowStock" | "outOfStock";
  minStock?: number;
  maxStock?: number;
  sortBy?: "name" | "price" | "stock" | "created_at";
  sortOrder?: "asc" | "desc";
}

// GET - Admin Products List (with filtering and search)
export const getProductsAdminService = async (params: AdminProductsQueryParams) => {
  // Validación ANTES del try-catch
  if (params.category && !params.category.trim()) {
    throw new ValidationError("Nombre de categoría inválido");
  }
  if (params.minPrice && params.minPrice < 0) {
    throw new ValidationError("Precio mínimo no puede ser negativo");
  }
  if (params.maxPrice && params.maxPrice < 0) {
    throw new ValidationError("Precio máximo no puede ser negativo");
  }
  if (params.minPrice && params.maxPrice && params.minPrice > params.maxPrice) {
    throw new ValidationError("Precio mínimo no puede ser mayor a precio máximo");
  }

  const safeLimit = Math.min(params.limit || DEFAULT_LIMIT, MAX_LIMIT);
  const safePage = Math.max(params.page || 1, 1);
  const skip = (safePage - 1) * safeLimit;
  const take = safeLimit;
  const sortOrder = params.sortOrder || "desc";

  try {
    // Build where clause dynamically
    const where: any = {};

    // Search by name/description
    if (params.search?.trim()) {
      where.OR = [
        { name: { contains: params.search.trim(), mode: "insensitive" } },
        { description: { contains: params.search.trim(), mode: "insensitive" } },
      ];
    }

    // Filter by category
    if (params.category) {
      where.categories = {
        name: { equals: params.category.trim(), mode: "insensitive" },
      };
    }

    // Filter by subcategory
    if (params.subcategory) {
      where.categories = {
        category_subcategory: {
          some: {
            subcategories: {
              name: { equals: params.subcategory.trim(), mode: "insensitive" },
            },
          },
        },
      };
    }

    // Filter by active status
    if (params.active !== undefined) {
      where.active = params.active;
    }

    // Filter by offer status
    if (params.inOffer) {
      where.in_offer = true;
    }

    // Filter by price range
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    // Filter by stock status
    if (params.stockStatus) {
      if (params.stockStatus === "inStock") {
        where.stock = { gt: 0 };
      } else if (params.stockStatus === "lowStock") {
        where.stock = { gt: 0, lte: 10 };
      } else if (params.stockStatus === "outOfStock") {
        where.stock = { lte: 0 };
      }
    }

    // Filter by min/max stock
    if (params.minStock !== undefined) {
      where.stock = { ...where.stock, gte: params.minStock };
    }
    if (params.maxStock !== undefined) {
      where.stock = { ...where.stock, lte: params.maxStock };
    }

    // Determine sort order
    let orderBy: any = { created_at: sortOrder };
    if (params.sortBy) {
      orderBy = { [params.sortBy]: sortOrder };
    }

    // Execute query with count for pagination
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          stock: true,
          active: true,
          in_offer: true,
          offer_discount: true,
          created_at: true,
          categories: { select: { name: true } },
          images: { select: { image_url: true }, take: 1 },
          product_variants: {
            select: { stock: true },
          },
        },
        skip,
        take,
        orderBy,
      }),
      prisma.products.count({ where }),
    ]);

    return {
      success: true,
      data: products,
      pagination: {
        total,
        page: params.page || 1,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  } catch (error: any) {
    if (error instanceof ValidationError) throw error;
    console.error("[getProductsAdminService] Error al obtener productos:", error);
    throw handlePrismaError(error);
  }
};

// PUT - Toggle product active/published status
export const toggleProductStatusService = async (
  productId: number,
  active: boolean
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!productId || productId <= 0) {
    throw new ValidationError("ID de producto inválido");
  }

  try {
    const existing = await prisma.products.findUnique({
      where: { id: productId },
    });

    if (!existing) {
      throw new NotFoundError("Producto no encontrado");
    }

    await prisma.products.update({
      where: { id: productId },
      data: { active },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[toggleProductStatusService] Error al cambiar estado del producto ${productId}:`, error);
    throw handlePrismaError(error);
  }
};

// DELETE - Bulk delete products
export const deleteProductsService = async (productIds: number[]): Promise<void> => {
  // Validación ANTES del try-catch
  if (!productIds || productIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de producto");
  }
  if (productIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de producto deben ser válidos");
  }

  try {
    // Check if all products exist
    const existingCount = await prisma.products.count({
      where: { id: { in: productIds } },
    });

    if (existingCount !== productIds.length) {
      throw new NotFoundError("Uno o más productos no fueron encontrados");
    }

    // Delete all products
    await prisma.products.deleteMany({
      where: { id: { in: productIds } },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[deleteProductsService] Error al eliminar productos:", error);
    throw handlePrismaError(error);
  }
};

// PUT - Bulk edit products (category and active status)
export const editProductsService = async (
  productIds: number[],
  data: { category?: number; active?: boolean }
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!productIds || productIds.length === 0) {
    throw new ValidationError("Debe proporcionar al menos un ID de producto");
  }
  if (productIds.some((id) => id <= 0)) {
    throw new ValidationError("Los IDs de producto deben ser válidos");
  }
  if (Object.keys(data).length === 0) {
    throw new ValidationError("Debe proporcionar al menos un campo para actualizar");
  }

  try {
    // Check if all products exist
    const existingCount = await prisma.products.count({
      where: { id: { in: productIds } },
    });

    if (existingCount !== productIds.length) {
      throw new NotFoundError("Uno o más productos no fueron encontrados");
    }

    // Update all products
    await prisma.products.updateMany({
      where: { id: { in: productIds } },
      data: {
        ...(data.category && { category_id: data.category }),
        ...(data.active !== undefined && { active: data.active }),
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error("[editProductsService] Error al editar productos:", error);
    throw handlePrismaError(error);
  }
};

// GET - Export all products for CSV/Excel
export const exportProductsService = async (): Promise<any[]> => {
  try {
    const products = await prisma.products.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        base_discount: true,
        active: true,
        in_offer: true,
        offer_discount: true,
        created_at: true,
        updated_at: true,
        categories: { select: { name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    // Format for export
    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: Number(p.price),
      stock: p.stock,
      discount: p.base_discount,
      active: p.active,
      inOffer: p.in_offer,
      offerDiscount: p.offer_discount,
      category: p.categories?.name || "Sin categoría",
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));
  } catch (error: any) {
    console.error("[exportProductsService] Error al exportar productos:", error);
    throw handlePrismaError(error);
  }
};
