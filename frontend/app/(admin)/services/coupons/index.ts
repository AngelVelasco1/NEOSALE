"use server";
import { prisma } from "@/lib/prisma";
import { FetchCouponsParams, FetchCouponsResponse } from "./types";
import { Prisma } from "@/prisma/generated/prisma/client";

export async function fetchCoupons(
  params: FetchCouponsParams
): Promise<FetchCouponsResponse> {
  const {
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
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
    ...(discountType && { discountType }),
    ...(featured && { featured }),
    ...(minDiscount !== undefined && { minDiscount: minDiscount.toString() }),
    ...(maxDiscount !== undefined && { maxDiscount: maxDiscount.toString() }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });

  const response = await fetch(`/api/coupons?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch coupons");
  }

  return response.json();
}
