"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";


import { cn } from "@/lib/utils";
import { navItems } from "./navItems";
import Typography from "@/app/(admin)/components/ui/typography";
import { Button } from "@/app/(admin)/components/ui/button";
import Image from "next/image";

interface AppSidebarProps {
  isOpen: boolean;
}

export default function AppSidebar({ isOpen }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`h-screen transition-all duration-300 border-r shadow-xl bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden fixed`}>
      <div className="h-full flex flex-col">
        {/* Logo Section with Premium Design */}
        <div className="flex-shrink-0 py-6 px-6 border-b border-slate-200 dark:border-slate-800">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
          >
            <div className="relative">
              <div className="relative rounded-xl shadow-lg">
                <Image
                  src="/imgs/Logo.png"
                  alt="NEOSALE"
                  width={60}
                  height={60}
                  className="transition-all duration-300 group-hover:scale-105 filter drop-shadow-lg"
                />
              </div>
            </div>
            <div>
              <Typography component="span" className="font-bold text-xl text-slate-900 dark:text-white block leading-tight">
                NeoSale
              </Typography>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-2">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <ul className="space-y-2">
            {navItems.map((navItem, index) => {
              const isActive = pathname === navItem.url;
              return (
                <li key={`nav-item-${index}`}>
                  <Link
                    href={navItem.url}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-800/60",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 text-slate-900 dark:text-white shadow-sm border border-blue-100 dark:border-blue-900/50"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full shadow-lg shadow-blue-500/50" />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "relative flex items-center justify-center transition-transform duration-200",
                      isActive && "scale-110"
                    )}>
                      <div className={cn(
                        "[&_svg]:size-5 [&_svg]:flex-shrink-0 transition-all duration-200",
                        isActive ? "text-blue-600 dark:text-blue-400 [&_svg]:drop-shadow-[0_2px_8px_rgba(59,130,246,0.3)]" : ""
                      )}>
                        {navItem.icon}
                      </div>
                    </div>

                    <span className="flex-1 font-semibold">{navItem.title}</span>

                    {/* Hover Effect */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <form action="/auth/sign-out" method="post">
            <Button
              type="submit"
              variant="outline"
              className="w-full bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-500/50 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <LogOut className="size-4 mr-2 flex-shrink-0 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
              <span className="font-semibold">Log out</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
