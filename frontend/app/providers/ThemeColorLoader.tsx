"use client";

import { useEffect, useRef } from "react";
import { getColorsFromStorage, applyColorsToDOM } from "./colorUtils";

export function ThemeColorLoader() {
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    // Prevenir ejecución múltiple durante hidratación
    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;

    // Usar requestAnimationFrame para aplicar después de la hidratación
    requestAnimationFrame(() => {
      const colors = getColorsFromStorage();
      applyColorsToDOM(colors.primary, colors.secondary, colors.accent);
    });

    // Escuchar cambios en localStorage (para sincronización entre tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "primary_color" ||
        e.key === "secondary_color" ||
        e.key === "accent_color" ||
        e.key === null
      ) {
        const colors = getColorsFromStorage();
        applyColorsToDOM(colors.primary, colors.secondary, colors.accent);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
