"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { X } from "lucide-react";

import Typography from "@/app/(admin)/components/ui/typography";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

interface AppSidebarProps {
  isOpen: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ isOpen, isMobile = false, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Prefetch agresivo de todas las rutas en paralelo
  useEffect(() => {
    const prefetchAll = async () => {
      const promises = navItems.map((item) => 
        router.prefetch(item.url)
      );
      await Promise.allSettled(promises);
    };
    prefetchAll();
  }, [router]);

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <aside
      className={cn(
        "group/sidebar fixed inset-y-0 left-0 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-slate-950/80 text-white shadow-[0_30px_70px_rgba(2,6,23,0.45)] backdrop-blur-xl transition-all duration-300 ease-in-out",
        // Desktop behavior
        "lg:z-40",
        !isMobile && (isOpen ? "lg:w-64" : "lg:w-0 lg:border-transparent"),
        // Mobile behavior
        isMobile && "z-50 w-64",
        isMobile && (isOpen ? "translate-x-0" : "-translate-x-full")
      )}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:150px_150px] opacity-35" />
      </div>

      <div
        className={cn(
          "relative flex h-full flex-col px-5 py-6 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all duration-200 lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="relative mb-6 rounded-3xl border-none px-4 py-5 text-center">
          <div className="absolute -top-8 left-1/2 h-28 w-28 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-10 right-6 h-24 w-24 rounded-full bg-purple-500/15 blur-2xl" />
          <Link href="/dashboard" onClick={handleLinkClick} className="relative z-10 flex flex-col items-center gap-4 group">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/10 py-3 px-2 backdrop-blur">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                <Image src="/imgs/Logo.png" alt="NEOSALE" width={58} height={58} className="relative z-10 drop-shadow-2xl" />
                <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 -translate-x-full group-hover:translate-x-full group-hover:opacity-100" />
              </div>
            </div>
            <div className="space-y-1">
              <Typography component="span" className="block font-black text-3xl tracking-tight bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                NeoSale
              </Typography>
              <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.5em] text-slate-300">
                <span className="h-px w-8 bg-linear-to-r from-transparent via-blue-400/60 to-transparent" />
                Admin Panel
                <span className="h-px w-8 bg-linear-to-r from-transparent via-purple-400/60 to-transparent" />
              </div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <ul className="space-y-1.5 border-none">
            {navItems.map((navItem) => {
              const toneClass = navItem.accent ?? "from-cyan-500/20 via-blue-500/15 to-transparent";
              const isActive = pathname === navItem.url;
              return (
                <li key={navItem.title} className="border-none">
                  <Link
                    href={navItem.url}
                    prefetch={true}
                    onClick={handleLinkClick}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-300 transition-colors duration-200",
                      "hover:border-white/5 hover:bg-white/5",
                      isActive && cn("text-white", "bg-gradient-to-r", toneClass)
                    )}
                  >
                    <span
                      className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/5 text-base text-slate-300 transition-all duration-200",
                        "[&_svg]:size-5",
                        isActive ? "text-white" : "group-hover:text-white"
                      )}
                    >
                      {navItem.icon}
                    </span>
                    <span className="relative z-10 flex-1 font-medium tracking-wide">
                      {navItem.title}
                    </span>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full bg-white/0 transition-opacity duration-200",
                        isActive ? "bg-white opacity-100" : "opacity-0 group-hover:opacity-70"
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
