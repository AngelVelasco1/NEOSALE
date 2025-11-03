"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";
import { Toaster } from "sonner";
import TanstackQueryProvider from "@/app/(admin)/lib/tanstack-query-provider";
import { UserProvider } from "@/app/(auth)/context/UserContext";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function RootProviders({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <TanstackQueryProvider>
          {children}
          <Toaster position="top-right" closeButton richColors />
        </TanstackQueryProvider>
      </UserProvider>
    </SessionProvider>
  );
}
