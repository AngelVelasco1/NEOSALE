import { prisma } from "../lib/prisma.js";

const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

interface SearchParams {
  query: string;
  limit?: number;
}

export const searchService = async ({ query, limit = DEFAULT_LIMIT }: SearchParams) => {
  // Validate and normalize query
  const normalizedQuery = query.trim();
  const validLimit = Math.max(1, Math.min(MAX_LIMIT, Math.trunc(limit || DEFAULT_LIMIT)));

  if (normalizedQuery.length < 2) {
    return {
      products: [],
      categories: [],
      customers: [],
    };
  }

  try {
    const [products, categories, customers] = await Promise.all([
      // Search products
      prisma.products.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
          active: true,
        },
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
          categories: {
            select: {
              name: true,
            },
            take: 1,
          },
          images: {
            where: {
              is_primary: true,
            },
            select: {
              image_url: true,
              color: true,
              color_code: true,
            },
            take: 1,
          },
        },
        orderBy: {
          updated_at: "desc" as const,
        },
        take: validLimit,
      }),
      // Search categories
      prisma.categories.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
          active: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: "asc" as const,
        },
        take: validLimit,
      }),
      // Search customers
      prisma.user.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive" as const,
          },
          active: true,
          role: "user",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: "asc" as const,
        },
        take: validLimit,
      }),
    ]);

    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        categoryName: product.categories?.name ?? null,
        image: product.images[0] ?? null,
      })),
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
      })),
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name,
        email: customer.email,
      })),
    };
  } catch (error) {
    console.error("Search service error:", error);
    throw error;
  }
};
