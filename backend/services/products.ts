import { prisma } from "../lib/prisma";

export const getProductsService = async (
  id?: number,
  category?: string,
  subcategory?: string
) => {
  if (!id) {
    if (subcategory) {
      const products = await prisma.products.findMany({
        where: {
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
        include: {
          images: true,
          categories: {
            include: {
              category_subcategory: {
                include: {
                  subcategories: true,
                },
              },
            },
          },
        },
      });

      console.log(
        `📊 Productos por subcategoría encontrados: ${products.length}`
      );
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
        subcategories:
          p.categories?.category_subcategory?.map(
            (cs) => cs.subcategories.name
          ) || [],
        images: p.images,
      }));
    } else if (category) {
      const products = await prisma.products.findMany({
        where: {
          categories: {
            name: {
              equals: category,
              mode: "insensitive",
            },
          },
        },
        include: {
          images: true,
          categories: {
            include: {
              category_subcategory: {
                include: {
                  subcategories: true,
                },
              },
            },
          },
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
        subcategories:
          p.categories?.category_subcategory?.map(
            (cs) => cs.subcategories.name
          ) || [],
        images: p.images,
      }));
    }

    // Fallback: devolver todos los productos
    const products = await prisma.products.findMany({
      include: {
        images: true,
        categories: {
          include: {
            category_subcategory: {
              include: {
                subcategories: true,
              },
            },
          },
        },
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
      subcategories:
        p.categories?.category_subcategory?.map(
          (cs) => cs.subcategories.name
        ) || [],
      images: p.images,
    }));
  }

  const product = await prisma.products.findUnique({
    where: { id },
    include: {
      images: true,
      categories: {
        include: {
          category_subcategory: {
            include: {
              subcategories: true,
            },
          },
        },
      },
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

export const getOffersService = async () => {
  const currentDate = new Date();
  
  const offers = await prisma.products.findMany({
    where: {
      in_offer: true,
      active: true,
      offer_start_date: {
        lte: currentDate,
      },
      offer_end_date: {
        gte: currentDate,
      },
    },
    include: {
      images: true,
      categories: {
        include: {
          category_subcategory: {
            include: {
              subcategories: true,
            },
          },
        },
      },
    },
    orderBy: {
      offer_discount: 'desc',
    },
  });

  return offers.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    sizes: p.sizes,
    base_discount: p.base_discount,
    offer_discount: p.offer_discount,
    offer_end_date: p.offer_end_date,
    image_url: p.images[0]?.image_url,
    color_code: p.images[0]?.color_code,
    color: p.images[0]?.color,
    category: p.categories?.name,
    subcategories:
      p.categories?.category_subcategory?.map(
        (cs) => cs.subcategories.name
      ) || [],
    images: p.images,
  }));
};
