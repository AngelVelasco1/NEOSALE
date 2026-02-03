"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/app/(admin)/lib/tanstack-query-provider";
import { UserProvider } from "@/app/(auth)/context/UserContext";
import { ThemeColorLoader } from "./ThemeColorLoader";
import { ColorInitializer } from "./ColorInitializer";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function RootProviders({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <TanstackQueryProvider>
          <ColorInitializer />
          <ThemeColorLoader />
          {children}
          <Toaster position="top-right" closeButton richColors />
        </TanstackQueryProvider>
      </UserProvider>
    </SessionProvider>
  );
}
