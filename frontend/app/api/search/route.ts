import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;
const DEFAULT_LIMIT = 5;
const MAX_LIMIT = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("q") ?? "";
  const normalizedQuery = rawQuery.trim();
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam)
    ? Math.max(1, Math.min(MAX_LIMIT, Math.trunc(limitParam)))
    : DEFAULT_LIMIT;

  if (normalizedQuery.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({
      success: true,
      results: {
        products: [],
        categories: [],
        customers: [],
      },
    });
  }

  try {
    const [products, categories, customers] = await Promise.all([
      prisma.products.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
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
          },
          images: {
            select: {
              image_url: true,
              color: true,
              color_code: true,
              is_primary: true,
            },
            orderBy: [{ is_primary: "desc" }, { id: "asc" }],
            take: 1,
          },
        },
        orderBy: {
          updated_at: "desc",
        },
        take: limit,
      }),
      prisma.categories.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: "asc",
        },
        take: limit,
      }),
      prisma.user.findMany({
        where: {
          name: {
            contains: normalizedQuery,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: "asc",
        },
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      results: {
        products: products.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          categoryName: product.categories?.name ?? null,
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
      },
    });
  } catch (error) {
    console.error("[api/search] Error while querying", error);
    return NextResponse.json(
      {
        success: false,
        message: "No se pudo completar la búsqueda",
      },
      { status: 500 }
    );
  }
}
