"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { User, Settings, LogOut, ChevronDown, Mail, Shield } from "lucide-react";
import { SignOut } from "@/app/(auth)/components/SingOut";

export function UserInfo() {
  const USER = {
    name: "John Smith",
    email: "johnson@nextadmin.com",
    img: "/images/user/user-03.png",
    role: "Administrator",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 rounded-xl transition-all">
        <span className="sr-only">My Account</span>

        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <div className="relative">
            <Image
              src={USER.img}
              className="size-9 rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
              alt={`Avatar of ${USER.name}`}
              role="presentation"
              width={36}
              height={36}
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="max-lg:hidden text-left">
            <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
              {USER.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {USER.role}
            </div>
          </div>

          <ChevronDown className="size-4 text-slate-400 max-lg:hidden" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[320px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-2"
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="px-3 py-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={USER.img}
                className="size-12 rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
                alt={`Avatar for ${USER.name}`}
                role="presentation"
                width={48}
                height={48}
              />
              <div className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 dark:text-white text-base leading-tight mb-1">
                {USER.name}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Mail className="size-3" />
                <span className="truncate">{USER.email}</span>
              </div>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg">
            <Shield className="size-3 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
              {USER.role}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-950/30 transition-colors">
              <User className="size-4 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                View Profile
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Manage your account
              </div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/pages/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
          >
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-950/30 transition-colors">
              <Settings className="size-4 text-slate-600 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                Settings
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Preferences & privacy
              </div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800 my-2" />

        {/* Logout */}
        <DropdownMenuItem className="px-2 py-1.5">
          <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer transition-colors group">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-950/30 transition-colors">
              <LogOut className="size-4 text-slate-600 dark:text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400" />
            </div>
            <SignOut />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
