import { prisma } from "../lib/prisma";

export const getProductsService = async (id?: number) => {
  if (!id) {
    const products = await prisma.products.findMany({
      include: {
        images: true,
        categories: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      sizes: p.sizes,
      image_url: p.images[0]?.image_url,
      color_code: p.images[0]?.color_code,
      color: p.images[0]?.color,
      category: p.categories?.name,
      images: p.images,
    }));
  }

  const product = await prisma.products.findUnique({
    where: { id },
    include: {
      images: true,
      categories: true,
    },
  });
  return product;
};

export const getLatestProductsService = async () => {
  const products = await prisma.products.findMany({
    orderBy: { id: "desc" },
    take: 6,
    include: {
      images: {
        take: 1,
      },
    },
  });
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    image_url: p.images[0]?.image_url,
    color_code: p.images[0]?.color_code,
    color: p.images[0]?.color,
  }));
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
        size
    },
    select: {
        product_id: true,
        stock: true,
        sku: true,
    }
  })
  return {
    stock: variant?.stock || 0,
    sku: variant?.sku || null,
    isAvailable: (variant?.stock || 0) > 0
  }
 };
