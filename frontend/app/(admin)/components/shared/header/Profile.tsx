"use client";

import Link from "next/link";
import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LayoutGrid, ChevronDown } from "lucide-react";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { SignOut } from "@/app/(auth)/components/SingOut";

export default function Profile() {
  const { userProfile, isLoading } = useUserSafe();
  const [open, setOpen] = useState(false);

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return "??";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-offset-2">
        <div className="relative">
          <Avatar className="h-9 w-9 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-500 dark:group-hover:ring-blue-600 transition-all duration-200 group-hover:scale-105">
            <AvatarImage
              src={undefined}
              alt={userProfile?.name ?? "User avatar"}
              className="object-cover object-center"
            />
            <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
              {getInitials(userProfile?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </div>

        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
            {userProfile?.name || "Usuario"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
            Administrador
          </span>
        </div>

        <ChevronDown className={`hidden sm:block h-4 w-4 text-slate-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-5}
        className="w-64 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
        sideOffset={8}
      >
        <DropdownMenuLabel className="p-3 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarImage
                src={undefined}
                alt={userProfile?.name ?? "User avatar"}
                className="object-cover object-center"
              />
              <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(userProfile?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {userProfile?.name || "Usuario"}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {userProfile?.email || "email@example.com"}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-slate-700" />

        <DropdownMenuItem asChild>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <LayoutGrid className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/edit-profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 focus:bg-slate-100 dark:focus:bg-slate-800"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Configuración</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-200 dark:bg-slate-700" />

        <DropdownMenuItem asChild>
          <SignOut />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
