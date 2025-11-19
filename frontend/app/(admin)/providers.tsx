"use client";

import React from "react";
import { SidebarProvider } from "./dashboard/components/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  );
}
