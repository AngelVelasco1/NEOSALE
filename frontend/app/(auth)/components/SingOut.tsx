"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const SignOut = () => {
  const handleSignOut = async () => {
    await signOut({
      redirectTo: "/login",
    });
  };
  
  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      className="w-full justify-start p-0 h-auto hover:bg-transparent border-none shadow-none group cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full">
        <div className="w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-red-600/20 flex items-center justify-center transition-all duration-300 shrink-0">
          <LogOut className="h-4 w-4 text-slate-400 group-hover:text-red-400 transition-colors" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="font-semibold text-red-400 group-hover:text-red-300 text-sm transition-colors truncate">
            Cerrar Sesión
          </p>
          <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors truncate">
            Salir de tu cuenta
          </p>
        </div>
      </div>
    </Button>
  );
};
