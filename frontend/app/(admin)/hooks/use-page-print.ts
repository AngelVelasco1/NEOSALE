"use client";

import { useCallback, useState } from "react";

export function usePagePrint() {
  const [isLoading, setIsLoading] = useState(false);

  const printPage = useCallback((pageUrl: string) => {
    setIsLoading(true);
    
    // DEBUG: Log la URL
    console.log("🖨️ Abriendo URL de impresión:", pageUrl);
    console.log("✅ URL completa:", `${window.location.origin}${pageUrl}`);

    // Abrir en nueva pestaña del MISMO ORIGEN (sin CORS)
    const printWindow = window.open(pageUrl, "print", "width=800,height=600");

    if (printWindow) {
      // DEBUG: Verificar si se abrió
      console.log("✅ Ventana abierta:", printWindow.name);
      
      printWindow.addEventListener("load", () => {
        console.log("✅ Página de impresión cargada");
        setIsLoading(false);
      });

      printWindow.addEventListener("error", () => {
        console.error("❌ Error al cargar la página de impresión");
        setIsLoading(false);
        printWindow.close();
      });
    } else {
      console.error("❌ No se pudo abrir la ventana de impresión");
      setIsLoading(false);
    }
  }, []);

  return { isLoading, printPage };
}
