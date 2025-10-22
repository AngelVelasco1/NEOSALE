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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ThemeToggle } from "./ThemeToggle";
import { useFavorites } from "../(customer)/favorites/context/useFavorites";
import { useCategories } from "../(customer)/(products)/hooks/useCategories";
import { getProducts } from "../(customer)/(products)/services/api";
import { IProduct } from "../(customer)/types";

const trendingSearches = [
  "iPhone 15",
  "MacBook Pro",
  "Nike Air Max",
  "Samsung TV",
  "PlayStation 5",
];

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
    className={`inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium ${className}`}
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

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const allProducts = await getProducts();
      const filtered = allProducts
        .filter(
          (product: IProduct) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);
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

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
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
      className={`w-full py-2 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-900 sticky top-0 z-50 transition-all duration-500  shadow-2xl shadow-slate-900/50`}
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
                className="w-80 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700 p-0"
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
                          href="/ofertas"
                          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Zap className="h-5 w-5 text-amber-400 group-hover:text-amber-300" />
                          <span className="font-medium text-white group-hover:text-amber-300">
                            Ofertas
                          </span>
                        </Link>
                      </div>

                      {/* Separador */}
                      <div className="h-px bg-slate-700"></div>

                      {/* Categorías */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-white text-sm uppercase tracking-wide">
                          Categorías
                        </h3>

                        {categoriesLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="animate-pulse space-y-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-700 rounded-lg"></div>
                                  <div className="h-4 bg-slate-700 rounded w-24"></div>
                                </div>
                                <div className="pl-11 space-y-2">
                                  <div className="h-3 bg-slate-800 rounded w-20"></div>
                                  <div className="h-3 bg-slate-800 rounded w-16"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          categories.map((category) => (
                            <div key={category.id} className="space-y-2">
                              <Link
                                href={createCategoryUrl(category.name)}
                                className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors group"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                  <category.icon className="h-4 w-4 text-blue-400" />
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="font-medium text-white group-hover:text-blue-300">
                                    {category.name}
                                  </span>
                                  {category.featured && (
                                    <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-medium">
                                      Popular
                                    </span>
                                  )}
                                </div>
                              </Link>

                              <div className="pl-11 space-y-1">
                                {category.subcategories
                                  .slice(0, 3)
                                  .map((sub) => (
                                    <Link
                                      key={sub.id}
                                      href={createCategoryUrl(
                                        category.name,
                                        sub.name
                                      )}
                                      className="block text-sm text-slate-300 hover:text-white py-2 px-3 rounded hover:bg-white/5 transition-colors"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                {category.subcategories.length > 3 && (
                                  <Link
                                    href={createCategoryUrl(category.name)}
                                    className="block text-sm text-blue-400 hover:text-blue-300 py-2 px-3 rounded hover:bg-blue-500/10 transition-colors font-medium"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    Ver todas +
                                    {category.subcategories.length - 3}
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))
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
            <NavigationMenuList className="gap-2 [&>li]:!bg-transparent [&>li]:!border-none [&>li]:!shadow-none">
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
                <NavigationMenuTrigger className="h-11 border-none bg-transparent hover:bg-white/10 rounded-xl font-medium transition-all duration-300  text-white data-[state=open]:bg-white/10 focus:outline-none focus:ring-0 [&>svg]:!text-white ">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-0 p-0 [&>div]:!bg-transparent [&>div]:!border-none [&>div]:!shadow-none [&>div]:!p-0">
                  <div className="w-[800px] h-[640px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl overflow-y-scroll border-2 border-slate-600/50 scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-blue-700 hover:scrollbar-thumb-slate-400 transition-colors">
                    {categoriesLoading ? (
                      <div className="grid grid-cols-3 gap-8 p-10">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse space-y-4 p-10">
                            <div className="h-20 bg-slate-700 rounded-lg p-10">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-600 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <div className="h-4 bg-slate-600 rounded w-24 mb-2"></div>
                                  <div className="h-3 bg-slate-700 rounded w-16"></div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-10 bg-slate-700 rounded"></div>
                              <div className="h-10 bg-slate-700 rounded"></div>
                              <div className="h-10 bg-slate-700 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                          <p className="text-slate-300 font-medium">
                            No hay categorías disponibles
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-8 p-8">
                        {categories.map((category) => (
                          <div key={category.id} className="relative">
                            <Link
                              href={createCategoryUrl(category.name)}
                              className="flex items-center gap-3 mb-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group h-20 border border-slate-600 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
                            >
                              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                <category.icon className="h-5 w-5 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2 group-hover:text-blue-300 transition-colors mb-1">
                                  {category.name}
                                </h3>
                                {category.featured && (
                                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded w-fit font-medium">
                                    Popular
                                  </span>
                                )}
                              </div>
                            </Link>

                            <div className="space-y-1">
                              {category.subcategories.slice(0, 5).map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={createCategoryUrl(
                                    category.name,
                                    sub.name
                                  )}
                                  className="block text-sm text-slate-300 hover:text-white py-2.5 px-3 rounded-lg hover:bg-white/5 transition-colors font-medium"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                              {category.subcategories.length > 5 && (
                                <Link
                                  href={createCategoryUrl(category.name)}
                                  className="block text-sm text-blue-400 hover:text-blue-300 py-2.5 px-3 rounded-lg hover:bg-blue-500/10 transition-colors font-semibold"
                                >
                                  Ver todas +{category.subcategories.length - 5}
                                </Link>
                              )}
                            </div>
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
                    href="/ofertas"
                    className="flex h-11 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-105  gap-2"
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
            <div className="hidden md:flex flex-1 max-w-sm mx-4">
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

                {/* Trending Searches */}
                {isSearchFocused && searchQuery.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 z-50">
                    <div className="text-sm mb-3 font-medium text-white">
                      Búsquedas populares:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-lg text-sm hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                          onClick={() => {
                            setSearchQuery(search);
                            setIsSearchFocused(false);
                          }}
                        >
                          {search}
                        </button>
                      ))}
                    </div>
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

              {/* Theme Toggle */}
              <div className=" rounded-lg p-1">
                <ThemeToggle />
              </div>

              {/* User Menu */}
              {userProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800"></div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-slate-800 border border-slate-600 shadow-2xl rounded-xl p-2"
                  >
                    <div className="p-4 border-b border-slate-600">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="font-medium text-white">
                          {userProfile?.name}
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="hover:bg-white/10 cursor-pointer rounded-lg p-3 font-medium text-white"
                    >
                      <User className="h-4 w-4 mr-3" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/orders")}
                      className="hover:bg-white/10 cursor-pointer rounded-lg p-3 font-medium text-white"
                    >
                      <ShoppingCart className="h-4 w-4 mr-3" />
                      Mis Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem className="text-red-400 hover:bg-red-500/10 rounded-lg p-3 font-medium">
                      <SignOut />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => router.push("/login")}
                  className="h-10 px-4 ml-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors font-medium"
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

          {/* Mobile Trending Searches */}
          {isSearchFocused && searchQuery.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4 z-50">
              <div className="text-sm mb-3 font-medium text-white">
                Búsquedas populares:
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    className="px-3 py-1.5 bg-white/10 text-slate-300 rounded-lg text-sm hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                    onClick={() => {
                      setSearchQuery(search);
                      setIsSearchFocused(false);
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </nav>
  );
};
