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
import { Settings, LayoutGrid, ChevronDown, Store } from "lucide-react";
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
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 animate-pulse" />
      </div>
    );
  }

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="group flex items-center gap-2 rounded-xl p-2 pr-3 transition-all duration-300 hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2 focus:ring-offset-slate-900">
        <div className="relative">
          <Avatar className="h-9 w-9 ring-2 ring-slate-700/50 group-hover:ring-indigo-500/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
            <AvatarImage
              src={userProfile?.image ?? undefined}
              alt={userProfile?.name ?? "User avatar"}
              className="object-cover object-center"
            />
            <AvatarFallback className="bg-linear-to-br from-indigo-500 via-violet-500 to-indigo-600 text-white text-xs font-bold shadow-lg">
              <div className="absolute inset-0 bg-linear-to-br from-indigo-400 to-violet-600 blur-md opacity-50"></div>
              <span className="relative z-10">{getInitials(userProfile?.name)}</span>
            </AvatarFallback>
          </Avatar>
          {/* Online status indicator with animation */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-linear-to-br from-green-400 to-emerald-500 rounded-full ring-2 ring-slate-900 shadow-lg">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col items-start min-w-0">
          <span className="text-sm font-bold text-slate-100 leading-tight truncate max-w-[120px]">
            {userProfile?.name || "Usuario"}
          </span>
          <span className="text-xs text-slate-400 leading-tight font-medium">
            Administrador
          </span>
        </div>

        <ChevronDown className={`hidden sm:block h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-all duration-300 ${open ? 'rotate-180' : ''}`} />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        alignOffset={-5}
        className="w-72 p-0 rounded-2xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
        sideOffset={8}
      >
        {/* Header with gradient */}
        <DropdownMenuLabel className="p-0">
          <div className="relative p-5 bg-linear-to-br from-purple-950/30 to-slate-950/95  border-b border-slate-700/50">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-950/30 to-slate-900/95 "></div>
            
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/20">
                  <AvatarImage
                    src={userProfile?.image ?? undefined}
                    alt={userProfile?.name ?? "User avatar"}
                    className="object-cover object-center"
                  />
                  <AvatarFallback className="bg-linear-to-br from-indigo-500 via-violet-500 to-indigo-600 text-white font-bold text-base">
                    <div className="absolute inset-0 bg-linear-to-br from-indigo-400 to-violet-600 blur-lg opacity-50"></div>
                    <span className="relative z-10">{getInitials(userProfile?.name)}</span>
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-linear-to-br from-green-400 to-emerald-500 rounded-full ring-2 ring-slate-900 shadow-lg"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-100 truncate">
                  {userProfile?.name || "Usuario"}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {userProfile?.email || "email@example.com"}
                </p>
                <p className="text-xs text-indigo-400 font-semibold mt-1">
                  👑 Administrador
                </p>
              </div>
            </div>
          </div>
        </DropdownMenuLabel>

        {/* Menu items */}
        <div className="p-2">
          <DropdownMenuItem asChild>
            <Link
              href="/store-settings"
              className="group flex items-center gap-3 py-3  mb-1 rounded-xl cursor-pointer transition-all duration-300 hover:bg-indigo-600/10 border border-transparent hover:border-indigo-500/30 focus:bg-indigo-600/10 focus:border-indigo-500/30"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-indigo-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20 shrink-0">
                <Store className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100">Personalizar Tienda</p>
                <p className="text-xs text-slate-400 group-hover:text-slate-300">Configura tu tienda</p>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/edit-profile"
              className="group flex items-center gap-3 py-3 mb-1 rounded-xl cursor-pointer transition-all duration-300 hover:bg-violet-600/10 border border-transparent hover:border-violet-500/30 focus:bg-violet-600/10 focus:border-violet-500/30"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-violet-600/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20 shrink-0">
                <Settings className="h-4 w-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100">Configuración</p>
                <p className="text-xs text-slate-400 group-hover:text-slate-300">Ajustes del perfil</p>
              </div>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-700/50" />

        {/* Logout button */}
        <div className="px-2 pb-2">
        <DropdownMenuItem className="group cursor-pointer rounded-xl p-3 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/30">
                                   <SignOut />
                               
                             </DropdownMenuItem>
                           </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
