"use client";

import {
  SearchIcon,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Zap,
  Package,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SignOut } from "../(auth)/components/SingOut";
import { useRouter } from "next/navigation";

import { useUserSafe } from "../(auth)/hooks/useUserSafe";
import { useMounted } from "../(auth)/hooks/useMounted";
import { useCart } from "../(customer)/(cart)/hooks/useCart";
import { useFavorites } from "../(customer)/favorites/context/useFavorites";
import { useCategories } from "../(customer)/(products)/hooks/useCategories";
import { getProducts } from "../(customer)/(products)/services/api";
import { IProduct } from "../(customer)/types";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile } = useUserSafe();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-white/10 transition-all duration-300 group"
      >
        <div className="relative">
          {/* Avatar with gradient and glow effect */}
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-900/90 to-blue-800 blur-md opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <span className="relative z-10">{userProfile?.name?.charAt(0).toUpperCase() || "U"}</span>
          </div>
          {/* Online status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 shadow-lg">
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-white group-hover:text-indigo-300 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-2xl p-0 overflow-hidden z-50">
          {/* Header with user info */}
          <div className="relative p-6 bg-gradient-to-br from-indigo-600/20 via-violet-600/20 to-slate-900/50 border-b border-slate-700/50">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 to-slate-900/95 "></div>

            <div className="relative flex items-center gap-4">
              {/* Larger avatar for header */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold ">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 blur-lg opacity-50"></div>
                  <span className="relative z-10">{userProfile?.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-slate-900 shadow-lg"></div>
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-base truncate">
                  {userProfile?.name}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {userProfile?.email || "usuario@neosale.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <div
              onClick={() => {
                router.push("/profile");
                setIsOpen(false);
              }}
              className="group cursor-pointer rounded-xl p-3 hover:bg-indigo-600/10 transition-all duration-300 border border-transparent hover:border-indigo-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-indigo-600/20 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                  <User className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">Mi Perfil</p>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300">Ver y editar información</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => {
                router.push("/orders");
                setIsOpen(false);
              }}
              className="group cursor-pointer rounded-xl p-3 mb-1 hover:bg-violet-600/10 transition-all duration-300 border border-transparent hover:border-violet-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800/50 group-hover:bg-violet-600/20 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-violet-500/20">
                  <ShoppingCart className="h-4 w-4 text-slate-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white text-sm">Mis Pedidos</p>
                  <p className="text-xs text-slate-400 group-hover:text-slate-300">Historial de compras</p>
                </div>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="px-2 pb-2">
            <div
              onClick={() => setIsOpen(false)}
              className="group cursor-pointer rounded-xl p-3 hover:bg-red-500/10 transition-all duration-300 border border-transparent hover:border-red-500/30"
            >
              <SignOut />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface NavLinkProps extends React.ComponentProps<typeof Link> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className = "",
  ...props
}) => (
  <Link
    href={href}
    className={`inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium transition-all duration-300  dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium ${className}`}
    {...props}
  >
    {children}
  </Link>
);

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "heart" | "cart";
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const variants = {
    default: `h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 rounded-xl hover:scale-110`,
    heart: `h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-pink-500 transition-all duration-300 rounded-xl hover:scale-110`,
    cart: `h-11 w-11 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-500 transition-all duration-300 rounded-xl hover:scale-110`,
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getCartProductCount } = useCart();
  const cartProductCount = getCartProductCount();
  const { favoritesCount } = useFavorites();
  const { userProfile } = useUserSafe();
  const mounted = useMounted();
  const { categories, loading: categoriesLoading } = useCategories();

  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const normalizeForSearch = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const allProducts = await getProducts();
      const queryNormalized = normalizeForSearch(query);
      const filtered = allProducts
        .filter(
          (product: IProduct) =>
            normalizeForSearch(product.name).includes(queryNormalized) ||
            normalizeForSearch(product.category).includes(queryNormalized)
        );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Error searching products:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
    }, 200);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchFocused(false);
      setSearchResults([]);
    }
  };

  const handleProductClick = (product: IProduct) => {
    router.push(`/${product.id}`);
    setIsSearchFocused(false);
    setSearchResults([]);
    setSearchQuery("");
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  if (!mounted) {
    return null;
  }

  // Función para crear URLs amigables para categorías y subcategorías
  const createCategoryUrl = (
    categoryName: string,
    subcategoryName?: string
  ) => {
    const baseSlug = categoryName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");

    if (subcategoryName) {
      const subSlug = subcategoryName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/gi, "")
        .replace(/\s+/g, "-");
      return `/category/${baseSlug}/${subSlug}`;
    }

    return `/category/${baseSlug}`;
  };

  return (
    <nav
      className={`w-full py-2 bg-linear-to-r from-slate-900 via-slate-900 to-slate-900 sticky top-0 z-50 transition-all duration-500  shadow-2xl shadow-slate-900/50`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu + Logo Section */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden group hover:bg-white/10 rounded-xl transition-all duration-200 w-10 h-10"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <Menu className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-200" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 bg-linear-to-b from-slate-800 to-slate-900 border-r border-slate-700 p-0"
              >
                <div className="flex flex-col h-full">
                  {/* Header del menú móvil */}
                  <div className="flex items-center justify-between p-6 border-b border-slate-700">
                    <h2 className="text-lg font-semibold text-white">Menú</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="hover:bg-white/10"
                    >
                      <X className="h-5 w-5 text-white" />
                    </Button>
                  </div>

                  {/* Contenido del menú */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      {/* Enlaces principales */}
                      <div className="space-y-2">
                        <Link
                          href="/"
                          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-medium text-white group-hover:text-blue-300">
                            Inicio
                          </span>
                        </Link>

                        <Link
                          href="/products"
                          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Package className="h-5 w-5 text-slate-300 group-hover:text-blue-300" />
                          <span className="font-medium text-white group-hover:text-blue-300">
                            Productos
                          </span>
                        </Link>

                        <Link
                          href="/offers"
                          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-red-500/20 transition-colors group border border-transparent hover:border-orange-500/30"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Zap className="h-5 w-5 text-orange-400 group-hover:animate-pulse" />
                          <span className="font-medium text-white group-hover:text-orange-300">
                            Ofertas
                          </span>
                        </Link>
                      </div>

                      {/* Separador */}
                      <div className="h-px bg-slate-700"></div>

                      {/* Categorías */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-6">
                          <div className="h-px bg-gradient-to-r from-blue-500/40 to-transparent flex-1"></div>
                          <h3 className="font-semibold text-white text-sm uppercase tracking-wider whitespace-nowrap">
                            Categorías
                          </h3>
                          <div className="h-px bg-gradient-to-l from-blue-500/40 to-transparent flex-1"></div>
                        </div>

                        {categoriesLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="animate-pulse space-y-2 p-4 rounded-xl bg-gradient-to-r from-slate-700/30 to-slate-800/30 border border-slate-700/30"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg"></div>
                                  <div className="h-4 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg w-32"></div>
                                </div>
                                <div className="pl-12 space-y-2">
                                  <div className="h-3 bg-slate-700/50 rounded-lg w-24"></div>
                                  <div className="h-3 bg-slate-700/50 rounded-lg w-20"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {categories.map((category) => (
                              <div key={category.id} className="group">
                                <Link
                                  href={createCategoryUrl(category.name)}
                                  className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/15 hover:to-cyan-500/10 transition-all duration-300 group/link border border-transparent hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500/25 to-cyan-500/15 rounded-lg flex items-center justify-center group-hover/link:from-blue-500/35 group-hover/link:to-cyan-500/25 transition-all duration-300 group-hover/link:shadow-lg group-hover/link:shadow-blue-500/20 border border-blue-500/20 group-hover/link:border-blue-400/40">
                                    <category.icon className="h-5 w-5 text-blue-300 group-hover/link:text-blue-200 transition-colors" />
                                  </div>
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="font-semibold text-white group-hover/link:text-blue-200 transition-colors">
                                      {category.name}
                                    </span>
                                    {category.featured && (
                                      <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-amber-200 rounded-full font-semibold border border-amber-500/30 group-hover/link:from-amber-500/40 group-hover/link:to-orange-500/30 transition-all">
                                        Destacada
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-slate-400 group-hover/link:text-blue-300 transition-colors opacity-0 group-hover/link:opacity-100">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                </Link>

                                <div className="pl-4 space-y-1.5 mt-2">
                                  {category.subcategories.slice(0, 3).map((sub) => (
                                    <Link
                                      key={sub.id}
                                      href={createCategoryUrl(category.name, sub.name)}
                                      className="block text-sm text-slate-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/8 transition-all duration-300 border border-transparent hover:border-slate-600/50 font-medium group/sub"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400/50 group-hover/sub:bg-blue-300 transition-colors"></div>
                                        {sub.name}
                                      </div>
                                    </Link>
                                  ))}
                                  {category.subcategories.length > 3 && (
                                    <Link
                                      href={createCategoryUrl(category.name)}
                                      className="block text-sm text-blue-400 hover:text-blue-300 py-2.5 px-3 rounded-lg hover:bg-blue-500/15 transition-all duration-300 font-semibold border border-transparent hover:border-blue-500/30 mt-2 group/more"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>Ver todas las subcategorías</span>
                                        <span className="text-xs px-2 py-1 bg-blue-500/25 rounded-full text-blue-300 group-hover/more:bg-blue-500/35 transition-all">
                                          +{category.subcategories.length - 3}
                                        </span>
                                      </div>
                                    </Link>
                                  )}
                                </div>

                                <div className="h-px bg-gradient-to-r from-slate-700/0 via-slate-700/30 to-slate-700/0 my-2"></div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center group ml-2 lg:ml-4">
              <div className="relative">
                <Image
                  src="/imgs/Logo.png"
                  alt="NEOSALE"
                  width={65}
                  height={65}
                  className="transition-all duration-300 group-hover:scale-105 filter drop-shadow-lg"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centrado */}
          <NavigationMenu className="hidden lg:flex flex-1 justify-center max-w-4xl mx-4 ">
            <NavigationMenuList className="gap-2 [&>li]:bg-transparent! [&>li]:border-none! [&>li]:shadow-none!">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink
                    href="/"
                    className="px-6 text-white hover:text-white hover:bg-white/10"
                  >
                    Inicio
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink
                    href="/products"
                    className="px-6 text-white hover:text-white hover:bg-white/10"
                  >
                    Productos
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

            

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-11 border-none bg-transparent hover:bg-white/10 rounded-xl font-medium transition-all duration-300 text-white data-[state=open]:bg-white/10 focus:outline-none focus:ring-0 [&>svg]:!text-white">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-0 p-0 [&>div]:bg-transparent [&>div]:!border-none [&>div]:!shadow-none [&>div]:!p-0 border-none">
                  <div className="w-[900px] h-[680px] bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950 rounded-2xl shadow-2xl shadow-blue-600/20 overflow-y-auto border border-slate-700/50 scrollbar-thin scrollbar-thumb-slate-700/60 scrollbar-track-slate-900/50 hover:scrollbar-thumb-slate-600/80 transition-colors">
             

                    {categoriesLoading ? (
                      <div className="grid grid-cols-3 gap-6 p-8">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse space-y-4">
                            <div className="h-24 bg-gradient-to-br from-blue-900/30 to-purple-900/20 rounded-xl p-4 border border-slate-700/40">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-purple-500/20 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 min-w-0 space-y-2">
                                  <div className="h-4 bg-gradient-to-r from-blue-500/30 to-purple-500/20 rounded-lg w-28"></div>
                                  <div className="h-3 bg-blue-700/20 rounded-lg w-20"></div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-10 bg-gradient-to-r from-blue-500/25 to-purple-500/15 rounded-lg"></div>
                              <div className="h-10 bg-gradient-to-r from-purple-500/25 to-indigo-500/15 rounded-lg"></div>
                              <div className="h-10 bg-gradient-to-r from-indigo-500/25 to-fuchsia-500/15 rounded-lg"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600/30 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700/40 shadow-lg shadow-blue-600/20">
                            <Package className="h-8 w-8 text-blue-300" />
                          </div>
                          <p className="text-slate-300 font-medium text-lg">
                            No hay categorías disponibles
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-6 p-8">
                        {categories.map((category) => (
                          <div key={category.id} className="group">
                            {/* Category Header */}
                            <Link
                              href={createCategoryUrl(category.name)}
                              className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-gradient-to-br from-blue-500/15 via-purple-500/12 to-indigo-500/10 hover:from-blue-500/25 hover:via-purple-500/20 hover:to-indigo-500/15 transition-all duration-300 group/link h-24 border border-slate-700/40 hover:border-slate-600/60 hover:shadow-lg hover:shadow-blue-600/20 relative overflow-hidden"
                            >
                              {/* Background glow effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-500/4 to-indigo-600/3 group-hover/link:from-blue-600/15 group-hover/link:via-purple-500/12 group-hover/link:to-indigo-600/10 transition-all duration-300"></div>

                              <div className="w-12 h-12 bg-gradient-to-br from-blue-600/40 via-purple-600/30 to-indigo-700/25 rounded-xl flex items-center justify-center group-hover/link:from-blue-500/60 group-hover/link:via-purple-500/50 group-hover/link:to-indigo-600/40 transition-all duration-300 group-hover/link:shadow-lg group-hover/link:shadow-blue-500/30 border border-slate-700/50 group-hover/link:border-slate-600/70 flex-shrink-0 relative z-10">
                                <category.icon className="h-6 w-6 text-slate-200 group-hover/link:text-slate-100 transition-colors drop-shadow-lg" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center relative z-10">
                                <h3 className="font-bold text-slate-200 text-base leading-tight group-hover/link:text-slate-100 transition-colors mb-1.5 drop-shadow-lg">
                                  {category.name}
                                </h3>
                                {category.featured && (
                                  <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-fuchsia-500/30 to-purple-500/25 text-purple-200 rounded-full w-fit font-bold border border-slate-700/40 group-hover/link:from-fuchsia-500/50 group-hover/link:to-purple-500/40 transition-all shadow-lg shadow-purple-500/20">
                                    ⭐ Destacada
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-300 group-hover/link:text-slate-200 transition-colors opacity-0 group-hover/link:opacity-100 relative z-10 drop-shadow-lg">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </Link>

                            {/* Subcategories */}
                            <div className="space-y-1.5">
                              {category.subcategories.slice(0, 5).map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={createCategoryUrl(category.name, sub.name)}
                                  className="flex items-center gap-2.5 text-sm text-slate-300 hover:text-slate-200 py-3 px-3 rounded-lg bg-transparent hover:bg-gradient-to-r hover:from-blue-500/15 hover:via-purple-500/12 hover:to-indigo-500/10 transition-all duration-300 font-medium border border-transparent hover:border-slate-700/40 group/sub"
                                >
                                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400/60 to-indigo-400/50 group-hover/sub:shadow-lg group-hover/sub:shadow-purple-400/40 transition-all flex-shrink-0"></div>
                                  <span className="truncate">{sub.name}</span>
                                </Link>
                              ))}
                              {category.subcategories.length > 5 && (
                                <Link
                                  href={createCategoryUrl(category.name)}
                                  className="flex items-center justify-between text-sm text-slate-300 hover:text-slate-200 py-3 px-3 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-purple-500/15 hover:from-fuchsia-500/30 hover:to-purple-500/25 transition-all duration-300 font-bold border border-slate-700/40 hover:border-slate-600/60 mt-2 group/more shadow-lg shadow-purple-500/15"
                                >
                                  <span>Ver todas</span>
                                  <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/25 rounded-full text-purple-200 group-hover/more:from-indigo-500/50 group-hover/more:to-fuchsia-500/40 transition-all font-bold shadow-lg shadow-indigo-500/20">
                                    +{category.subcategories.length - 5}
                                  </span>
                                </Link>
                              )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-slate-700/0 via-purple-500/30 to-slate-700/0 mt-4"></div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild className="flex flex-row">
                  <Link
                    href="/offers"
                    className="flex h-11 w-fit items-center justify-center rounded-xl bg-linear-to-r from-orange-400/90 to-orange-600 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-orange-600 hover:to-red-700 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-105  gap-2"
                  >
                    <Zap className="h-4 w-4 flex-shrink-0" />
                    <span>Ofertas</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-300 z-10" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="pl-12 pr-4 w-full h-10 rounded-xl border-slate-600 bg-white/10 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors backdrop-blur-sm"
                />

                {/* Search Results Dropdown */}
                {isSearchFocused && searchQuery.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-slate-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        Buscando...
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-2">
                        <div className="text-xs text-slate-500 mb-2 px-2">
                          Resultados de búsqueda:
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product)}
                            className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                                <Image
                                  src={
                                    product.image_url ||
                                    product.images?.[0]?.image_url ||
                                    "/imgs/person.png"
                                  }
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-white group-hover:text-blue-300 truncate">
                                  {product.name}
                                </div>
                                <div className="text-xs text-slate-400">
                                  {product.category}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        <div className="border-t border-slate-700 mt-2 pt-2">
                          <button
                            onClick={handleSearchSubmit}
                            className="w-full text-left p-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          >
                            Ver todos los resultados para {searchQuery}
                          </button>
                        </div>
                      </div>
                    ) : searchQuery.length > 2 ? (
                      <div className="p-4 text-center text-slate-400">
                        No se encontraron productos para {searchQuery}
                      </div>
                    ) : null}
                  </div>
                )}


              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Favorites */}
              <div className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/favorites")}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Heart className="h-5 w-5 text-slate-300 hover:text-pink-400" />
                </Button>
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500 text-white font-bold">
                    {favoritesCount}
                  </Badge>
                )}
              </div>

              {/* Cart */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/productsCart")}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <ShoppingCart className="h-5 w-5 text-slate-300 hover:text-blue-400" />
                </Button>
                {cartProductCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-500 text-white font-bold">
                    {cartProductCount}
                  </Badge>
                )}
              </div>
              {/* User Menu */}
              {userProfile ? (
                <UserMenu />
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  className="cursor-pointer h-10 px-4 ml-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium"
                >
                  Iniciar Sesión
                </Button>
              )}
               
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-200 z-10" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="pl-12 pr-4 w-full h-10 rounded-xl border-slate-600 bg-white/10 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors backdrop-blur-sm"
          />

          {/* Mobile Search Results */}
          {isSearchFocused && searchQuery.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-slate-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                  Buscando...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="p-2">
                  <div className="text-xs text-slate-500 mb-2 px-2">
                    Resultados de búsqueda:
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleProductClick(product)}
                      className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          <Image
                            src={
                              product.image_url ||
                              product.images?.[0]?.image_url ||
                              "/imgs/person.png"
                            }
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-white group-hover:text-blue-300 truncate">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {product.category} • $
                            {product.price.toLocaleString("es-CO")}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-left p-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                    >
                      Ver todos los resultados para "{searchQuery}"
                    </button>
                  </div>
                </div>
              ) : searchQuery.length > 2 ? (
                <div className="p-4 text-center text-slate-400">
                  No se encontraron productos para "{searchQuery}"
                </div>
              ) : null}
            </div>
          )}


        </form>
      </div>
    </nav>
  );
};
