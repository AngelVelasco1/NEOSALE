"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import Container from "@/app/(admin)/components/ui/container";
import { cn } from "@/lib/utils";

const Header = dynamic(
  () => import("@/app/(admin)/components/shared/header"),
  {
    loading: () => <div className="h-16" />,
  }
);

const AppSidebar = dynamic(
  () => import("@/app/(admin)/components/shared/sidebar/AppSidebar"),
  {
    loading: () => <div className="lg:w-64" />,
  }
);


interface LayoutProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function LayoutProvider({ children, defaultOpen = true }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Solo ajustar el sidebar automáticamente en la inicialización o cuando cambia el breakpoint
      if (!isInitialized) {
        setSidebarOpen(!mobile);
        setIsInitialized(true);
      } else if (wasMobile !== mobile) {
        // Solo cambiar si hubo un cambio real en el breakpoint
        setSidebarOpen(!mobile);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, isInitialized]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 transition-all duration-300",
        !isMobile && sidebarOpen && "lg:ml-64"
      )}>
        <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-x-hidden">
          <div className="py-6 print:!py-0">
            <Container>
              {children}
            </Container>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutProvider defaultOpen={true}>
      {children}
    </LayoutProvider>
  );
}
