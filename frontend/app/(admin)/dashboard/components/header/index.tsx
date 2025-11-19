"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Menu, Sparkles } from "lucide-react";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";

export function Header() {
  const { toggleSidebar } = useSidebarContext();

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Menu className="size-5 text-slate-700 dark:text-slate-300" />
              <span className="sr-only">Toggle Sidebar</span>
            </button>

            {/* Page Title with Greeting */}
            <div className="max-lg:hidden">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  Dashboard
                </h1>
                <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md">
                  <Sparkles className="size-3.5 text-white" />
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                {getCurrentGreeting()}, welcome back!
              </p>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative max-md:hidden">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search anything..."
                className="w-[280px] lg:w-[320px] pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-transparent rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 outline-none transition-all duration-200 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 dark:focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggleSwitch />
              <Notification />

              {/* Divider */}
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />

              <UserInfo />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
