"use client";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Session } from "next-auth";
import React from "react";
interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function RootProviders({ children, session }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </ThemeProvider>
  );
}
