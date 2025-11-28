"use client";

import { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Función helper para obtener colores de fallback
const getFallbackColor = (prop: string): string => {
  const fallbacks: Record<string, string> = {
    color: "rgb(0, 0, 0)",
    backgroundColor: "rgb(255, 255, 255)",
    borderTopColor: "rgb(229, 231, 235)",
    borderRightColor: "rgb(229, 231, 235)",
    borderBottomColor: "rgb(229, 231, 235)",
    borderLeftColor: "rgb(229, 231, 235)",
    outlineColor: "rgb(59, 130, 246)",
  };
  return fallbacks[prop] || "transparent";
};

// Función helper para aplicar colores basados en clases de Tailwind
const applyClassBasedColors = (element: HTMLElement) => {
  const classList = element.classList;

  // Colores de texto
  if (classList.contains("text-primary")) {
    element.style.setProperty("color", "rgb(59, 130, 246)", "important");
  }
  if (classList.contains("text-black")) {
    element.style.setProperty("color", "rgb(0, 0, 0)", "important");
  }
  if (classList.contains("text-muted-foreground")) {
    element.style.setProperty("color", "rgb(113, 113, 122)", "important");
  }
  if (classList.contains("text-slate-400")) {
    element.style.setProperty("color", "rgb(148, 163, 184)", "important");
  }

  // Colores de fondo
  if (classList.contains("bg-white")) {
    element.style.setProperty(
      "background-color",
      "rgb(255, 255, 255)",
      "important"
    );
  }
  if (classList.contains("bg-muted")) {
    element.style.setProperty(
      "background-color",
      "rgb(244, 244, 245)",
      "important"
    );
  }

  // Bordes
  if (classList.contains("border-print-border")) {
    element.style.setProperty(
      "border-color",
      "rgb(229, 231, 235)",
      "important"
    );
  }
  if (classList.contains("bg-print-border")) {
    element.style.setProperty(
      "background-color",
      "rgb(229, 231, 235)",
      "important"
    );
  }
  if (classList.contains("border")) {
    element.style.setProperty(
      "border-color",
      "rgb(228, 228, 231)",
      "important"
    );
  }
};

export function usePdfDownload() {
  const [isLoading, setIsLoading] = useState(false);

  const downloadTemplate = async ({
    htmlId,
    pdfName,
  }: {
    htmlId: string;
    pdfName: string;
  }) => {
    const templateElement = document.getElementById(htmlId);

    if (!templateElement) {
      console.error("Template element not found!");
      return;
    }

    setIsLoading(true);

    try {
      // PASO 1: Crear mapa de estilos computados ANTES de clonar
      const styleMap = new Map<Element, Record<string, string>>();

      const captureStyles = (element: Element) => {
        if (!(element instanceof HTMLElement)) return;

        const computed = window.getComputedStyle(element);
        const styles: Record<string, string> = {};

        // Capturar todas las propiedades de color
        const colorProps = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "outlineColor",
          "fill",
          "stroke",
        ];

        colorProps.forEach((prop) => {
          const value = computed.getPropertyValue(prop);
          if (
            value &&
            value !== "rgba(0, 0, 0, 0)" &&
            value !== "transparent"
          ) {
            styles[prop] = value;
          }
        });

        styleMap.set(element, styles);

        // Procesar hijos
        Array.from(element.children).forEach((child) => captureStyles(child));
      };

      // Capturar estilos del elemento original
      captureStyles(templateElement);

      const canvas = await html2canvas(templateElement, {
        logging: false,
        scale: 2,
        imageTimeout: 15000,
        useCORS: true,
        allowTaint: true,
        width: 794,
        height: 1123,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc, clonedElement) => {
          if (!clonedElement) return;

          // PASO 2: Aplicar estilos RGB al documento clonado
          const applyRgbStyles = (original: Element, cloned: Element) => {
            if (!(cloned instanceof HTMLElement)) return;

            const styles = styleMap.get(original);

            if (styles) {
              Object.entries(styles).forEach(([prop, value]) => {
                // Convertir cualquier función no soportada a RGB
                if (
                  value.includes("oklch") ||
                  value.includes("color(") ||
                  value.includes("color-mix") ||
                  value.includes("lab(") ||
                  value.includes("lch(")
                ) {
                  // Usar color de fallback directamente
                  cloned.style.setProperty(
                    prop,
                    getFallbackColor(prop),
                    "important"
                  );
                } else {
                  // Si ya es RGB/RGBA/HEX, aplicar directamente
                  cloned.style.setProperty(prop, value, "important");
                }
              });
            }

            // Aplicar fallbacks hardcoded basados en clases
            applyClassBasedColors(cloned);

            // Procesar hijos recursivamente
            const originalChildren = Array.from(original.children);
            const clonedChildren = Array.from(cloned.children);

            originalChildren.forEach((origChild, index) => {
              if (clonedChildren[index]) {
                applyRgbStyles(origChild, clonedChildren[index]);
              }
            });
          };

          applyRgbStyles(templateElement, clonedElement);
        },
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4", true);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = (pdfHeight - imgHeight * ratio) / 2;
      pdf.addImage(
        imageData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );

      pdf.save(`${pdfName}.pdf`);
    } catch (error) {
      console.error("Failed to download pdf:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { downloadTemplate, isLoading };
}
