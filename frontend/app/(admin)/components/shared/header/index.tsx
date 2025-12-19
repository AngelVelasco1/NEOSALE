"use client";

import { Suspense } from "react";
import { MenuIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Profile from "@/app/(admin)/components/shared/header/Profile";
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
    <header className="sticky top-0 z-30 bg-linear-to-r from-slate-900/85 via-slate-800/90 to-slate-900/90 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 backdrop-blur-xl border-b border-white/10 dark:border-white/5 shadow-2xl">
      {/* Gradient Orbs Background */}
      <div className="absolute top-0 right-0 w-96 h-32 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-64 h-24 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative flex items-center justify-between gap-4 px-4 lg:px-6 py-3.5">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="group relative flex items-center justify-center h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 dark:border-white/5 overflow-hidden"
            aria-label="Toggle sidebar"
          >
            {/* Hover gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <MenuIcon size={20} className="relative z-10 text-slate-300 dark:text-slate-400 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
          </button>

          {/* Page Title - Hidden on mobile */}
          <div className="hidden md:block relative">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="ml-4 t text-lg lg:text-xl font-bold bg-linear-to-r from-white via-blue-200 to-purple-200 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent tracking-wide">
                Panel Administrativo
              </h1>
              {/* Decorative Badge */}
             
            </div>
            <p className="hidden lg:block text-sm text-slate-400 dark:text-slate-500 font-medium ml-4 tracking-wide ">
              ¡{getCurrentGreeting()}!, <span className="text-slate-300 dark:text-slate-400 font-semibold ">{session?.user?.name || "Usuario"}</span>
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:block relative group">
            {/* Search icon with gradient on hover */}
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
              <Search className="size-4 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300" />
            </div>
            <input
              type="search"
              placeholder="Buscar en el panel..."
              className="w-[240px] xl:w-[300px] pl-10 pr-4 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:focus:bg-white/10 backdrop-blur-md border border-white/10 dark:border-white/5 rounded-xl text-sm text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-blue-400/50 dark:focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-500/5 focus:shadow-lg focus:shadow-blue-500/10"
            />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 dark:border-white/5 transition-all duration-300"
          >
            <Search className="h-5 w-5 text-slate-300 dark:text-slate-400" />
          </Button>

         

          {/* Notifications */}
          <Suspense fallback={
            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 dark:border-white/5 animate-pulse" />
          }>
            <Notifications />
          </Suspense>

          {/* Divider - Hidden on mobile */}
          <div className="hidden sm:block w-px h-8 bg-white/10 dark:bg-white/5 mx-1" />

          {/* Profile */}
          <Suspense fallback={
            <div className="h-10 w-24 rounded-xl bg-white/5 border border-white/10 dark:border-white/5 animate-pulse" />
          }>
            <Profile />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
