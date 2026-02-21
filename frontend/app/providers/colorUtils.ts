/**
 * Color utilities para sincronización sin conflictos de hidratación
 */

export const DEFAULT_COLORS = {
  primary: "#3b82f6",
  secondary: "#0ea5e9",
  accent: "#d946ef",
};

// Convertir hex a RGB
export const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "59, 130, 246";
};

// Aplicar colores al DOM
export const applyColorsToDOM = (
  primary?: string,
  secondary?: string,
  accent?: string
): void => {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (primary) {
    root.style.setProperty("--color-primary", primary);
    root.style.setProperty("--color-primary-rgb", hexToRgb(primary));
  }

  if (secondary) {
    root.style.setProperty("--color-secondary", secondary);
    root.style.setProperty("--color-secondary-rgb", hexToRgb(secondary));
  }

  if (accent) {
    root.style.setProperty("--color-accent", accent);
    root.style.setProperty("--color-accent-rgb", hexToRgb(accent));
  }
};

// Obtener colores desde localStorage
export const getColorsFromStorage = () => {
  if (typeof localStorage === "undefined") {
    return DEFAULT_COLORS;
  }

  return {
    primary: localStorage.getItem("primary_color") || DEFAULT_COLORS.primary,
    secondary: localStorage.getItem("secondary_color") || DEFAULT_COLORS.secondary,
    accent: localStorage.getItem("accent_color") || DEFAULT_COLORS.accent,
  };
};

// Guardar colores en localStorage
export const saveColorsToStorage = (
  primary?: string,
  secondary?: string,
  accent?: string
): void => {
  if (typeof localStorage === "undefined") return;

  if (primary) localStorage.setItem("primary_color", primary);
  if (secondary) localStorage.setItem("secondary_color", secondary);
  if (accent) localStorage.setItem("accent_color", accent);
};
