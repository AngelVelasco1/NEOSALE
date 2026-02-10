import { prisma } from "../lib/prisma";

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
  images: {
    select: {
      image_url: true,
      color_code: true,
      color: true,
    },
    take: 1,
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

const formatProductForList = (p: any) => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  stock: p.stock,
  sizes: p.sizes,
  discount: p.base_discount,
  image_url: p.images[0]?.image_url,
  color_code: p.images[0]?.color_code,
  color: p.images[0]?.color,
  category: p.categories?.name,
});

export const getProductsService = async (
  id?: number,
  category?: string,
  subcategory?: string,
  paginationParams?: PaginationParams
) => {
  const { skip, take } = getPaginationParams(paginationParams?.page, paginationParams?.limit);

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
                    equals: subcategory,
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
              equals: category,
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
    throw new Error("Producto no encontrado");
  }

  return product;
};

export const getLatestProductsService = async () => {
  const products = await prisma.products.findMany({
    where: { active: true },
    select: productListSelect,
    orderBy: { created_at: "desc" },
    take: 8,
  });

  return products.map(formatProductForList);
};

export const getVariantStockService = async (
  id: number,
  color_code: string,
  size: string
) => {
  if (!id || !color_code || !size) {
    throw new Error("Parámetros faltantes");
  }

  const variant = await prisma.product_variants.findFirst({
    where: {
      product_id: id,
      color_code,
      size,
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
};

export const getOffersService = async (paginationParams?: PaginationParams) => {
  const { skip, take } = getPaginationParams(paginationParams?.page, paginationParams?.limit);
  const currentDate = new Date();

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
};
