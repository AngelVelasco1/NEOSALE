"use client";

import { useEffect } from "react";

export function NonCriticalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/non-critical.css";
    link.media = "print";
    link.onload = () => {
      link.media = "all";
    };

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
