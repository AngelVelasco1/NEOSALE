/**
 * ColorInitializer
 * Carga los colores de la tienda desde la BD al iniciar la aplicación
 */

"use client";

import { useEffect } from "react";

export function ColorInitializer() {
  useEffect(() => {
    // Función para convertir hex a RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "59, 130, 246";
    };

    // Función para aplicar colores a CSS variables
    const applyColorsToDOM = (colors: {primary?: string; secondary?: string; accent?: string}) => {
      const root = document.documentElement;
      if (colors.primary) {
        root.style.setProperty("--color-primary", colors.primary);
        root.style.setProperty("--color-primary-rgb", hexToRgb(colors.primary));
      }
      if (colors.secondary) {
        root.style.setProperty("--color-secondary", colors.secondary);
        root.style.setProperty("--color-secondary-rgb", hexToRgb(colors.secondary));
      }
      if (colors.accent) {
        root.style.setProperty("--color-accent", colors.accent);
        root.style.setProperty("--color-accent-rgb", hexToRgb(colors.accent));
      }
    };

    // Cargar colores desde la BD
    const loadColorsFromDB = async () => {
      try {
        const response = await fetch("/api/store-settings/colors", { 
          cache: "no-store" 
        });
        if (response.ok) {
          const data = await response.json();
          
          // Guardar en localStorage
          if (data.primary_color) localStorage.setItem("primary_color", data.primary_color);
          if (data.secondary_color) localStorage.setItem("secondary_color", data.secondary_color);
          if (data.accent_color) localStorage.setItem("accent_color", data.accent_color);
          
          // Aplicar inmediatamente a DOM
          applyColorsToDOM({
            primary: data.primary_color,
            secondary: data.secondary_color,
            accent: data.accent_color,
          });

          // Disparar evento storage para notificar a otras partes
          window.dispatchEvent(new Event("storage"));
        }
      } catch (error) {
        console.error("Error loading colors:", error);
      }
    };

    // Cargar colores al iniciar
    loadColorsFromDB();

    // Verificar periódicamente si hay cambios en localStorage (para sincronización entre tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "primary_color" || e.key === "secondary_color" || e.key === "accent_color") {
        applyColorsToDOM({
          primary: localStorage.getItem("primary_color") || undefined,
          secondary: localStorage.getItem("secondary_color") || undefined,
          accent: localStorage.getItem("accent_color") || undefined,
        });
      }
    };

    // Polyfill: Verificar localStorage cada 500ms para detectar cambios desde otras tabs
    const interval = setInterval(() => {
      const storedPrimary = localStorage.getItem("primary_color");
      const storedSecondary = localStorage.getItem("secondary_color");
      const storedAccent = localStorage.getItem("accent_color");
      
      if (storedPrimary || storedSecondary || storedAccent) {
        applyColorsToDOM({
          primary: storedPrimary || undefined,
          secondary: storedSecondary || undefined,
          accent: storedAccent || undefined,
        });
      }
    }, 500);

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return null;
}
