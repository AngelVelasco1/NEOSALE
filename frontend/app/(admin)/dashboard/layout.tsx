"use client";

import React, { useState } from "react";

import Header from "@/app/(admin)/components/shared/header";
import Container from "@/app/(admin)/components/ui/container";
import AppSidebar from "@/app/(admin)/components/shared/sidebar/AppSidebar";

interface LayoutProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function LayoutProvider({ children, defaultOpen = true }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(defaultOpen);



  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-0'
        } overflow-hidden`}>
        <AppSidebar isOpen={sidebarOpen} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1">
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
