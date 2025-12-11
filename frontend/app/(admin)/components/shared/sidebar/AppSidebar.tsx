"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


import { cn } from "@/lib/utils";
import { navItems } from "./navItems";
import Typography from "@/app/(admin)/components/ui/typography";
import Image from "next/image";

interface AppSidebarProps {
  isOpen: boolean;
}

export default function AppSidebar({ isOpen }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`h-screen transition-all duration-300 border shadow-2xl backdrop-blur-xl bg-linear-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950/95 border-r-2 border-slate-200 rounded-xl dark:border-white/5 ${isOpen ? 'w-64' : 'w-0 border-none'} overflow-hidden fixed`}>
      <div className="h-full flex flex-col py-8">
        {/* Logo Section */}
        <div className="shrink-0 px-5 relative">
          {/* Background Gradient Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/15 rounded-full blur-2xl" />

          <Link
            href="/dashboard"
            className="relative flex flex-col items-center gap-4 group"
          >
            {/* Logo Container with Glass Effect */}
            <div className="relative">
              {/* Outer Glow */}
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/40 via-purple-500/30 to-pink-500/20 rounded-2xl blur-2xl group-hover:blur-3xl opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse" />

              {/* Glass Frame */}
              <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-white/10 dark:bg-white/5 backdrop-blur-md py-3 px-2 w-fit h-fit group-hover:scale-105 transition-all duration-500 border border-white/20 dark:border-white/10">
                {/* Inner gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-transparent to-purple-500/10" />

                <Image
                  src="/imgs/Logo.png"
                  alt="NEOSALE"
                  width={58}
                  height={58}
                  className="transition-all duration-500 relative z-10 drop-shadow-2xl"
                />

                {/* Shine effect */}
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transition: 'all 1s' }} />
              </div>
            </div>

            {/* Text Container */}
            <div className="text-center relative z-10 space-y-1">
              <Typography
                component="span"
                className="font-black text-3xl bg-linear-to-r from-white via-blue-200 to-purple-200 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent block leading-tight tracking-tight drop-shadow-lg"
              >
                NeoSale
              </Typography>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-8 bg-linear-to-r from-transparent via-blue-400/50 to-transparent" />
                <span className="text-[11px] text-slate-300 dark:text-slate-400 font-semibold tracking-widest uppercase">
                  Admin Panel
                </span>
                <div className="h-px w-8 bg-linear-to-r from-transparent via-purple-400/50 to-transparent" />
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-white/10 dark:scrollbar-thumb-white/5 scrollbar-track-transparent">
          <ul className="space-y-2 flex flex-col h-full justify-center">
            {navItems.map((navItem, index) => {
              const isActive = pathname === navItem.url;
              return (
                <li key={`nav-item-${index}`}>
                  <Link
                    href={navItem.url}
                    className={cn(
                      "group relative flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 overflow-hidden",
                      "hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
                      isActive
                        ? "bg-linear-to-r from-blue-700/30 via-blue-600/30 to-transparent text-white shadow-lg  border-l-4 border-blue-500"
                        : "text-slate-300 dark:text-slate-400 hover:text-white border-l-4 border-transparent hover:border-none"
                    )}
                  >
                    {/* Active gradient overlay */}
                    {isActive && (
                      <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/5 to-transparent animate-pulse" />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "relative flex items-center justify-center transition-all duration-300 z-10",
                      isActive && "scale-110"
                    )}>
                      <div className={cn(
                        "[&_svg]:size-5 [&_svg]:shrink-0 transition-all duration-300",
                        isActive ? "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" : "group-hover:text-blue-300"
                      )}>
                        {navItem.icon}
                      </div>
                    </div>

                    <span className={cn(
                      "flex-1 font-semibold transition-all duration-300 z-10",
                      isActive && "font-bold"
                    )}>
                      {navItem.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
