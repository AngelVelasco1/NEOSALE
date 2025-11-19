"use client";

import { Suspense } from "react";
import { MenuIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Profile from "@/app/(admin)/components/shared/header/Profile";
import ThemeToggle from "@/app/(admin)/components/shared/header/ThemeToggle";
import Notifications from "@/app/(admin)/components/shared/notifications/Notifications";
import { useSession } from "next-auth/react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session } = useSession();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 py-3.5">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="flex items-center justify-center h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105 cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <MenuIcon size={20} className="text-slate-700 dark:text-slate-300" strokeWidth={2.5} />
          </button>

          {/* Page Title - Hidden on mobile */}
          <div className="hidden md:block">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                Panel Administrativo
              </h1>

            </div>
            <p className="hidden lg:block text-sm text-slate-600 dark:text-slate-400 font-medium">
              ¡{getCurrentGreeting()}!, {session?.user?.name || "Usuario"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:block relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-[240px] xl:w-[300px] pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
            />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Search className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          </Button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <Suspense fallback={
            <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          }>
            <Notifications />
          </Suspense>

          {/* Divider - Hidden on mobile */}
          <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Profile */}
          <Suspense fallback={
            <div className="h-10 w-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
          }>
            <Profile />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
