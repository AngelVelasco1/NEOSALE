import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useTransition } from "react";

type Props = {
  scroll?: boolean;
};

export function useUpdateQueryString({ scroll = true }: Props = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Memoizar el string de parámetros para comparación confiable
  const searchParamsString = useMemo(() => searchParams.toString(), [searchParams]);

  const updateQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParamsString);
      const newValue = value.toString();
      
      // Solo hacer push si el valor realmente cambió
      if (params.get(name) === newValue) {
        return;
      }
      
      params.set(name, newValue);
      const newParamsString = params.toString();
      
      // Solo hacer push si los parámetros realmente cambiaron
      if (newParamsString !== searchParamsString) {
        startTransition(() => {
          router.push(`${pathname}?${newParamsString}`, { scroll });
        });
      }
    },
    [pathname, router, searchParamsString, scroll, startTransition]
  );

  return { updateQueryString, isPending };
}
