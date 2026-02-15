"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma/client";

export type GetProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  subcategory?: number;
  brand?: number;
  active?: boolean;
  inOffer?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: "in-stock" | "out-of-stock";
  minStock?: number;
  maxStock?: number;
  sortBy?: "price" | "created_at" | "updated_at" | "name" | "stock";
  sortOrder?: "asc" | "desc";
};

// Helper function to serialize Decimal fields to numbers
function serializeProduct<T extends Record<string, unknown>>(product: T): T {
  const images = product.images as Array<{ image_url: string }> | undefined;
  const primaryImage = images && images.length > 0 ? images[0].image_url : undefined;
  
  // Calcular stock total desde las variantes activas
  const variants = product.product_variants as Array<{ stock: number; size: string; active: boolean }> | undefined;
  const totalStock = variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
  
  // Extraer sizes únicos de las variantes si no existe el campo sizes
  const sizesFromVariants = variants
    ? [...new Set(variants.map(v => v.size))].sort().join(", ")
    : "";
  
  return {
    ...product,
    price: product.price ? Number(product.price) : null,
    base_discount: product.base_discount ? Number(product.base_discount) : null,
    offer_discount: product.offer_discount
      ? Number(product.offer_discount)
      : null,
    image_url: primaryImage, // Agregar imagen por defecto
    stock: totalStock, // Stock real calculado desde variantes
    sizes: product.sizes || sizesFromVariants, // Usar sizes del producto o extraerlos de variantes
  };
}

export async function getProducts({
  page = 1,
  limit = 10,
  search,
  category,
  subcategory,
  brand,
  active,
  inOffer,
  minPrice,
  maxPrice,
  stockStatus,
  minStock,
  maxStock,
  sortBy = "created_at",
  sortOrder = "desc",
}: GetProductsParams = {}) {
  try {
    // Construir el where dinámicamente
    const where: Prisma.productsWhereInput = {};

    // Búsqueda por nombre, descripción o SKU
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          product_variants: {
            some: {
              sku: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    // Filtro por categoría
    if (category) {
      where.category_id = category;
    }

    // Filtro por subcategoría
    if (subcategory) {
      where.categories = {
        subcategory: {
          id: subcategory,
        },
      };
    }

    // Filtro por marca
    if (brand) {
      where.brand_id = brand;
    }

    // Filtro por estado activo/publicado
    if (active !== undefined) {
      where.active = active;
    }

    // Filtro por ofertas
    if (inOffer !== undefined) {
      where.in_offer = inOffer;
    }

    // Filtro por rango de precio
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    // Filtro por disponibilidad de stock
    if (stockStatus) {
      where.stock = stockStatus === "in-stock" ? { gt: 0 } : { equals: 0 };
    } else if (minStock !== undefined || maxStock !== undefined) {
      // Filtro por rango de stock numérico (solo si no hay stockStatus)
      where.stock = {};
      if (minStock !== undefined) {
        where.stock.gte = minStock;
      }
      if (maxStock !== undefined) {
        where.stock.lte = maxStock;
      }
    }

    // Construir el orderBy
    const orderBy: Prisma.productsOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

    // Ejecutar queries en paralelo para mejor rendimiento
    const [data, total] = await Promise.all([
      prisma.products.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: {
          categories: {
            select: {
              id: true,
              name: true,
            },
          },
          brands: {
            select: {
              id: true,
              name: true,
            },
          },
          images: {
            orderBy: [
              { is_primary: 'desc' },
              { id: 'asc' }
            ],
            select: {
              image_url: true,
              color: true,
              color_code: true,
              is_primary: true,
            },
          },
          product_variants: {
            where: {
              active: true,
            },
            select: {
              id: true,
              stock: true,
              size: true,
              color: true,
              color_code: true,
            },
          },
        },
      }),
      prisma.products.count({ where }),
    ]);

    // Serialize products para convertir Decimal a number
    const serializedData = data.map(serializeProduct);


    return {
      data: serializedData,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(productId: number) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      include: {
        categories: true,
        brands: true,
        images: {
          orderBy: [
            { is_primary: 'desc' },
            { id: 'asc' }
          ],
        },
        product_variants: {
          where: {
            active: true,
          },
          include: {
            images: {
              orderBy: [
                { is_primary: 'desc' },
                { id: 'asc' }
              ],
            },
          },
        },
      },
    });

    // Serialize product to convert Decimal fields to numbers
    if (!product) return null;

    // Calcular stock total desde variantes
    const totalStock = product.product_variants.reduce((sum, v) => sum + v.stock, 0);

    // Eliminar imágenes duplicadas - solo mantener una imagen por color_code
    const uniqueImages = product.images.reduce((acc, img) => {
      const existingImage = acc.find(i => i.color_code === img.color_code && i.image_url === img.image_url);
      if (!existingImage) {
        acc.push(img);
      }
      return acc;
    }, [] as typeof product.images);

    const serializedProduct = {
      ...serializeProduct(product),
      stock: totalStock,
      images: uniqueImages, // Usar imágenes únicas
      product_variants: product.product_variants.map((variant) => ({
        ...variant,
        price: variant.price ? Number(variant.price) : null,
        images: variant.images || [],
      })),
    };

    return serializedProduct;
  } catch (error) {
    
    throw new Error("Failed to fetch product");
  }
}
