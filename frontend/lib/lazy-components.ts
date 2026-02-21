import dynamic, { DynamicOptions } from "next/dynamic";
import { ComponentType } from "react";
import React from "react";

interface LazyLoadOptions {
  delay?: number;
  loading?: () => React.ReactNode;
}

/**
 * Lazy load un componente con delay opcional
 * Útil para deferrir componentes no-críticos después del inicial render
 */
export function lazyLoadComponent<P extends object = object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const { delay = 0, loading } = options;

  const dynamicOptions: DynamicOptions<P> = {
    ssr: false,
    ...(loading && { loading }),
  };

  if (delay === 0) {
    return dynamic(importFn, dynamicOptions);
  }

  // Wrappear el import con delay
  return dynamic(
    () =>
      new Promise<{ default: ComponentType<P> }>((resolve) => {
        setTimeout(() => {
          importFn().then(resolve);
        }, delay);
      }),
    dynamicOptions
  );
}

/**
 * Lazy load un componente cuando entra en viewport
 */
export function lazyLoadOnScroll<P extends object = object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: Omit<DynamicOptions<P>, 'ssr'> = {}
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => React.createElement("div", { className: "w-full h-80 bg-slate-800 animate-pulse rounded" }),
    ...options,
  } as DynamicOptions<P>);
}
