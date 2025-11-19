"use client";

import React, { useState, useEffect } from "react";

import Header from "@/app/(admin)/components/shared/header";
import Container from "@/app/(admin)/components/ui/container";
import AppSidebar from "@/app/(admin)/components/shared/sidebar/AppSidebar";

interface LayoutProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function LayoutProvider({ children, defaultOpen = true }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`${isMobile
        ? `fixed inset-y-0 left-0 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
        : `${sidebarOpen ? 'w-64' : 'w-0'}`
        } transition-all duration-300 ease-in-out overflow-hidden`}>
        <AppSidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden">
          <div className="py-6 print:!py-0">
            <Container>{children}</Container>
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
