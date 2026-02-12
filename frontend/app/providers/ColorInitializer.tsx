/**
 * ColorInitializer
 * Carga los colores de la tienda desde la BD al iniciar la aplicación
 */

"use client";

import { useEffect, useRef } from "react";
import { applyColorsToDOM, saveColorsToStorage } from "./colorUtils";

export function ColorInitializer() {
  const hasInitializedRef = useRef(false);
  const loadingRef = useRef(false);

  useEffect(() => {
    // Prevenir ejecución múltiple durante hidratación
    if (hasInitializedRef.current || loadingRef.current) return;

    loadingRef.current = true;

    // Cargar colores desde la BD
    const loadColorsFromDB = async () => {
      try {
        const response = await fetch("/api/store-settings/colors", {
          cache: "no-cache",
        });

        if (response.ok) {
          const data = await response.json();

          // Guardar en localStorage
          saveColorsToStorage(
            data.primary_color,
            data.secondary_color,
            data.accent_color
          );

          // Aplicar con requestAnimationFrame para después de hidratación
          requestAnimationFrame(() => {
            applyColorsToDOM(
              data.primary_color,
              data.secondary_color,
              data.accent_color
            );
          });

          // Disparar evento storage para notificar a otras partes
          window.dispatchEvent(new StorageEvent("storage"));
        }
      } catch (error) {
        
      } finally {
        hasInitializedRef.current = true;
        loadingRef.current = false;
      }
    };

    // Usar requestAnimationFrame para ejecutar después de la hidratación
    requestAnimationFrame(() => {
      loadColorsFromDB();
    });

    // Escuchar cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key === "primary_color" ||
        e.key === "secondary_color" ||
        e.key === "accent_color"
      ) {
        const primary = localStorage.getItem("primary_color");
        const secondary = localStorage.getItem("secondary_color");
        const accent = localStorage.getItem("accent_color");

        applyColorsToDOM(
          primary || undefined,
          secondary || undefined,
          accent || undefined
        );
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
