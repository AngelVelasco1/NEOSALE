"use server";
import { prisma } from "@/lib/prisma";
import { FetchCouponsParams, FetchCouponsResponse } from "./types";

export async function fetchCoupons({
  page = 1,
  limit = 10,
  search,
}: FetchCouponsParams): Promise<FetchCouponsResponse> {
  try {
    const baseCondition = {
      deleted_at: null,
    };

    const whereCondition = search
      ? {
          ...baseCondition,
          OR: [
            {
              code: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : baseCondition;

    const [couponsRaw, total] = await Promise.all([
      prisma.coupons.findMany({
        where: whereCondition,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.coupons.count({
        where: whereCondition,
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

    return {
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    throw new Error("Failed to fetch coupons");
  }
}
