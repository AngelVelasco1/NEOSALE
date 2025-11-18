"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { FaBagShopping } from "react-icons/fa6";

import { cn } from "@/lib/utils";
import { navItems } from "./navItems";
import Typography from "@/app/(admin)/components/ui/typography";
import { Button } from "@/app/(admin)/components/ui/button";

interface AppSidebarProps {
  isOpen: boolean;
}

export default function AppSidebar({ isOpen }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`h-full transition-all duration-300 border-r shadow-lg bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden`}>
      <div className="pb-20 h-full">
        <div className="py-6 px-3 flex flex-col overflow-y-auto h-full">
          {/* Logo Section with Premium Design */}
          <div className="mb-8 px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 group hover:opacity-90 transition-opacity"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl">
                  <FaBagShopping className="size-6 text-white" />
                </div>
              </div>
              <div>
                <Typography component="span" className="font-bold text-xl text-slate-800 dark:text-white block leading-tight">
                  Zorvex
                </Typography>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Admin Panel</span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2">
            <ul className="space-y-1.5">
              {navItems.map((navItem, index) => {
                const isActive = pathname === navItem.url;
                return (
                  <li key={`nav-item-${index}`}>
                    <Link
                      href={navItem.url}
                      className={cn(
                        "group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200",
                        "hover:bg-slate-200/60 dark:hover:bg-slate-800/50",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 to-purple-600/10 text-slate-900 dark:text-white shadow-lg shadow-blue-500/5"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
                      )}

                      {/* Icon with gradient on active */}
                      <div className={cn(
                        "relative flex items-center justify-center transition-transform duration-200",
                        isActive && "scale-110"
                      )}>
                        <div className={cn(
                          "[&_svg]:size-5 [&_svg]:flex-shrink-0 transition-all duration-200",
                          isActive && "[&_svg]:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                        )}>
                          {navItem.icon}
                        </div>
                      </div>

                      <span className="flex-1">{navItem.title}</span>

                      {/* Hover Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                        isActive && "opacity-100"
                      )} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="relative left-0 w-full right-0 bottom-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-gradient-to-t from-slate-100 dark:from-slate-950 to-transparent">
              <form action="/auth/sign-out" method="post">
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-slate-300 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-slate-800 hover:border-red-300 dark:hover:border-red-500/50 text-slate-700 dark:text-slate-200 hover:text-red-600 dark:hover:text-white transition-all duration-200 group"
                >
                  <LogOut className="size-4 mr-2 flex-shrink-0 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors" />
                  <span className="font-medium">Log out</span>
                </Button>
              </form>
            </div>
          </nav>
        </div>

        {/* Logout Button - Premium Design */}

      </div>
    </div>
  );
}
