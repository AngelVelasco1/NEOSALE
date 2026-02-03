"use client";

import { useEffect } from "react";

export function useApplyThemeColors(primaryColor?: string, secondaryColor?: string, accentColor?: string) {
  useEffect(() => {
    if (!primaryColor && !secondaryColor && !accentColor) return;

    // Convertir hexadecimal a RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "59, 130, 246"; // fallback azul
    };

    const root = document.documentElement;

    if (primaryColor) {
      root.style.setProperty("--color-primary", primaryColor);
      root.style.setProperty("--color-primary-rgb", hexToRgb(primaryColor));
    }

    if (secondaryColor) {
      root.style.setProperty("--color-secondary", secondaryColor);
      root.style.setProperty("--color-secondary-rgb", hexToRgb(secondaryColor));
    }

    if (accentColor) {
      root.style.setProperty("--color-accent", accentColor);
      root.style.setProperty("--color-accent-rgb", hexToRgb(accentColor));
    }

    // También guardar en localStorage para persistencia
    if (primaryColor) localStorage.setItem("primary_color", primaryColor);
    if (secondaryColor) localStorage.setItem("secondary_color", secondaryColor);
    if (accentColor) localStorage.setItem("accent_color", accentColor);
  }, [primaryColor, secondaryColor, accentColor]);
}

export function useLoadThemeColors() {
  useEffect(() => {
    const primaryColor = localStorage.getItem("primary_color") || "#3b82f6";
    const secondaryColor = localStorage.getItem("secondary_color") || "#0ea5e9";
    const accentColor = localStorage.getItem("accent_color") || "#d946ef";

    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "59, 130, 246";
    };

    const root = document.documentElement;
    root.style.setProperty("--color-primary", primaryColor);
    root.style.setProperty("--color-primary-rgb", hexToRgb(primaryColor));
    root.style.setProperty("--color-secondary", secondaryColor);
    root.style.setProperty("--color-secondary-rgb", hexToRgb(secondaryColor));
    root.style.setProperty("--color-accent", accentColor);
    root.style.setProperty("--color-accent-rgb", hexToRgb(accentColor));
  }, []);
}
