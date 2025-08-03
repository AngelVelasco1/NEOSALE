"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function RootProviders({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      {children} <Toaster position="top-right" closeButton richColors />
    </SessionProvider>
  );
}
