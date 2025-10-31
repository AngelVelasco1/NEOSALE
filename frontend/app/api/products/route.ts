import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const published = searchParams.get("published");

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category_id = parseInt(category);
    }

    if (status === "out-of-stock") {
      where.stock = { lte: 0 };
    } else if (status === "selling") {
      where.stock = { gt: 0 };
    }

    if (published !== null && published !== undefined) {
      where.active = published === "true";
    }

    // Obtener productos con paginación
    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where,
        include: {
          categories: {
            select: {
              name: true,
            },
          },
          images: {
            where: { is_primary: true },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
      }),
      prisma.products.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
