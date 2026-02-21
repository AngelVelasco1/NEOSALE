"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function PrintTrigger() {
  const searchParams = useSearchParams();
  const shouldPrint = searchParams.get("print") === "true";

  useEffect(() => {
    if (shouldPrint) {
      // Esperar a que todo esté completamente renderizado
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [shouldPrint]);

  return null;
}
