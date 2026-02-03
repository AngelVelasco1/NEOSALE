"use client";

import { useEffect, useState } from "react";

export function ThemeColorLoader() {
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#0ea5e9", 
    accent: "#d946ef",
  });

  useEffect(() => {
    // Función para convertir hex a RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "59, 130, 246";
    };

    // Función para aplicar colores a CSS variables
    const applyColors = (primary: string, secondary: string, accent: string) => {
      const root = document.documentElement;
      root.style.setProperty("--color-primary", primary);
      root.style.setProperty("--color-primary-rgb", hexToRgb(primary));
      root.style.setProperty("--color-secondary", secondary);
      root.style.setProperty("--color-secondary-rgb", hexToRgb(secondary));
      root.style.setProperty("--color-accent", accent);
      root.style.setProperty("--color-accent-rgb", hexToRgb(accent));
    };

    // Cargar colores iniciales
    const primaryColor = localStorage.getItem("primary_color") || "#3b82f6";
    const secondaryColor = localStorage.getItem("secondary_color") || "#0ea5e9";
    const accentColor = localStorage.getItem("accent_color") || "#d946ef";
    
    applyColors(primaryColor, secondaryColor, accentColor);
    setColors({ primary: primaryColor, secondary: secondaryColor, accent: accentColor });

    // Escuchar cambios en localStorage (para sincronización entre tabs y desde admin)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "primary_color" || e.key === "secondary_color" || e.key === "accent_color" || e.key === null) {
        const newPrimary = localStorage.getItem("primary_color") || primaryColor;
        const newSecondary = localStorage.getItem("secondary_color") || secondaryColor;
        const newAccent = localStorage.getItem("accent_color") || accentColor;
        
        applyColors(newPrimary, newSecondary, newAccent);
        setColors({ primary: newPrimary, secondary: newSecondary, accent: newAccent });
      }
    };

    // Escuchar cambios en localStorage (para sincronización entre tabs)
    window.addEventListener("storage", handleStorageChange);
    
    // También escuchar cambios directos en esta pestaña
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key: string, value: string) {
      originalSetItem.call(this, key, value);
      handleStorageChange(new StorageEvent("storage", { key, newValue: value }));
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  return null;
}
