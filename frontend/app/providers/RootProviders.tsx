"use client";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
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
  const [isHydrated, setIsHydrated] = useState(false);

  // Esperar a que el cliente se hidrate completamente
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // suppressHydrationWarning para evitar warnings innecesarios
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <TanstackQueryProvider>
          <ColorInitializer />
          <ThemeColorLoader />
          {isHydrated ? (
            <>
              {children}
              <Toaster position="top-right" closeButton richColors />
            </>
          ) : (
            children
          )}
        </TanstackQueryProvider>
      </UserProvider>
    </SessionProvider>
  );
}
