"use server";
import { prisma } from "@/lib/prisma";
import { FetchCouponsParams, FetchCouponsResponse } from "./types";
import { Prisma } from "@prisma/client";

export async function fetchCoupons({
  page = 1,
  limit = 10,
  search,
  status,
  discountType,
  featured,
  minDiscount,
  maxDiscount,
  sortBy,
  sortOrder,
}: FetchCouponsParams): Promise<FetchCouponsResponse> {
  try {
    const where: Prisma.couponsWhereInput = {
      deleted_at: null,
    };

    // Search filter
    if (search) {
      where.OR = [
        {
          code: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Status filter (active/expired)
    if (status && status !== "all") {
      const currentDate = new Date();
      if (status === "active") {
        where.expires_at = {
          gte: currentDate,
        };
        where.active = true;
      } else if (status === "expired") {
        where.expires_at = {
          lt: currentDate,
        };
      }
    }

    // Discount type filter
    if (discountType && discountType !== "all") {
      where.discount_type = discountType;
    }

    // Featured filter
    if (featured && featured !== "all") {
      where.featured = featured === "true";
    }

    // Discount range filter
    if (minDiscount !== undefined || maxDiscount !== undefined) {
      where.discount_value = {};
      if (minDiscount !== undefined) {
        where.discount_value.gte = minDiscount;
      }
      if (maxDiscount !== undefined) {
        where.discount_value.lte = maxDiscount;
      }
    }

    // Dynamic sorting
    let orderBy: Prisma.couponsOrderByWithRelationInput = {
      created_at: "desc",
    };
    if (sortBy && sortOrder) {
      const validSortFields: Record<string, string> = {
        name: "name",
        code: "code",
        discount_value: "discount_value",
        created_at: "created_at",
        expires_at: "expires_at",
        usage_count: "usage_count",
      };
      const field = validSortFields[sortBy];
      if (field) {
        orderBy = { [field]: sortOrder as "asc" | "desc" };
      }
    }

    const [couponsRaw, total] = await Promise.all([
      prisma.coupons.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.coupons.count({
        where,
      }),
    ]);

    const coupons = couponsRaw.map((coupon) => ({
      ...coupon,
      discount_value: Number(coupon.discount_value),
      min_purchase_amount: coupon.min_purchase_amount
        ? Number(coupon.min_purchase_amount)
        : null,
      deleted_at: coupon.deleted_at,
      deleted_by: coupon.deleted_by,
    }));

    // Mapear la estructura de paginación del servidor a la esperada por el frontend
    return {
      data: coupons,
      pagination: {
        current: page,
        limit: limit,
        items: total,
        pages: Math.ceil(total / limit),
        next: page < Math.ceil(total / limit) ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      },
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error("Failed to fetch coupons");
  }
}
