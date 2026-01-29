"use client";

import { useMemo } from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

interface StableSearchParamsResult {
  searchParams: ReadonlyURLSearchParams;
  searchParamsString: string;
}

/**
 * Normalizes Next.js search params so their string representation only changes
 * when the actual query string changes. Useful for stable React Query keys.
 */
export function useStableSearchParams(): StableSearchParamsResult {
  const searchParams = useSearchParams();

  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  const memoizedSearchParams = useMemo(
    () => new URLSearchParams(searchParamsString) as unknown as ReadonlyURLSearchParams,
    [searchParamsString]
  );

  return { searchParams: memoizedSearchParams, searchParamsString };
}
