// Constants for product filters
import { useState, useEffect } from "react";

export const PUBLISHED_PRESETS = [
  { value: "all", label: "Todos" },
  { value: "published", label: "Publicados" },
  { value: "draft", label: "Borradores" },
];

export const STOCK_PRESETS = [
  { value: "all", label: "Todos" },
  { value: "selling", label: "Con stock" },
  { value: "out-of-stock", label: "Agotados" },
];

// Debounce hook optimized for performance
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}