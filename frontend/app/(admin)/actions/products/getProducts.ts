"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { log } from "console";

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
  sortBy?: "price" | "created_at" | "updated_at";
  sortOrder?: "asc" | "desc";
};

// Helper function to serialize Decimal fields to numbers
function serializeProduct<T extends Record<string, unknown>>(product: T): T {
  return {
    ...product,
    price: product.price ? Number(product.price) : null,
    base_discount: product.base_discount ? Number(product.base_discount) : null,
    offer_discount: product.offer_discount
      ? Number(product.offer_discount)
      : null,
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
  sortBy = "created_at",
  sortOrder = "desc",
}: GetProductsParams = {}) {
  try {
    // Construir el where dinámicamente
    const where: Prisma.productsWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category_id = category;
    }

    if (subcategory) {
      where.categories.subcategory.id = subcategory;
    }

    if (brand) {
      where.brand_id = brand;
    }

    if (active !== undefined) {
      where.active = active;
    }

    if (inOffer !== undefined) {
      where.in_offer = inOffer;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    if (stockStatus) {
      where.stock = stockStatus === "in-stock" ? { gt: 0 } : { equals: 0 };
    }

    // Construir el orderBy
    const orderBy: Prisma.productsOrderByWithRelationInput = {};
    orderBy[sortBy] = sortOrder;

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
              subcategory: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
        
          },
      
          brands: {
            select: {
              id: true,
              name: true,
            },
          },
          images: {
            where: {
              is_primary: true,
            },
            take: 1,
            select: {
              image_url: true,
            },
          },
        },
      }),
      prisma.products.count({ where }),
    ]);

    // Serialize products to convert Decimal to number
    const serializedData = data.map(serializeProduct);
    console.log(serializedData[0].categories);

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
    console.error("Error fetching products:", error);
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
        images: true,
        product_variants: {
          where: {
            active: true,
          },
          include: {
            images: true,
          },
        },
      },
    });

    // Serialize product to convert Decimal fields to numbers
    if (!product) return null;

    const serializedProduct = {
      ...serializeProduct(product),
      product_variants: product.product_variants.map((variant) => ({
        ...variant,
        price: variant.price ? Number(variant.price) : null,
      })),
    };

    return serializedProduct;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}
