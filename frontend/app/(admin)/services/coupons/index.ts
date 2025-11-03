import { Coupon, FetchCouponsParams, FetchCouponsResponse } from "./types";

export async function fetchCoupons(
  { page = 1, limit = 10, search }: FetchCouponsParams
): Promise<FetchCouponsResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  });

  const response = await fetch(`/api/coupons?${queryParams.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch coupons");
  }

  return response.json();
}
