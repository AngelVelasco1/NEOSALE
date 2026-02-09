import dynamic, { DynamicOptions } from "next/dynamic";
import { ComponentType } from "react";
import React from "react";

interface LazyLoadOptions extends DynamicOptions<Record<string, unknown>> {
  delay?: number;
}

/**
 * Lazy load un componente con delay opcional
 * Útil para deferrir componentes no-críticos después del inicial render
 */
export function lazyLoadComponent<P = object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyLoadOptions = {}
) {
  const { delay = 0, ...dynamicOptions } = options;

  if (delay === 0) {
    return dynamic(importFn, {
      ssr: false,
      ...dynamicOptions,
    });
  }

  // Wrappear el import con delay
  return dynamic(
    () =>
      new Promise<{ default: ComponentType<P> }>((resolve) => {
        setTimeout(() => {
          importFn().then(resolve);
        }, delay);
      }),
    {
      ssr: false,
      ...dynamicOptions,
    }
  );
}

/**
 * Lazy load un componente cuando entra en viewport
 */
export function lazyLoadOnScroll<P = object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicOptions<Record<string, unknown>> = {}
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => React.createElement("div", { className: "w-full h-80 bg-slate-800 animate-pulse rounded" }),
    ...options,
  });
}
