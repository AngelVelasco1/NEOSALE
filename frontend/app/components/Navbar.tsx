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
    className={`inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-all duration-200 hover:bg-accent hover:text-foreground font-inter ${className}`}
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
    default: `h-10 w-10 hover:bg-accent transition-all duration-200 rounded-lg hover:scale-110`,
    heart: `h-10 w-10 hover:bg-accent hover:text-pink-500 transition-all duration-200 rounded-lg hover:scale-110`,
    cart: `h-10 w-10 hover:bg-accent hover:text-emerald-500 transition-all duration-200 rounded-lg hover:scale-110`,
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
  const { getCartProductCount } = useCart();
  const cartProductCount = getCartProductCount();
  const { favoritesCount } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const { userProfile } = useUserSafe();
  const mounted = useMounted();
  const searchRef = useRef<HTMLInputElement>(null);
  const { categories, loading: categoriesLoading } = useCategories();

  const router = useRouter();

  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mounted]);

  const handleSearchRef = () => {
    if (searchRef.current) {
      searchRef.current.focus();
      setIsSearchFocused(true);
    }
  };

  if (!mounted) {
    return null;
  }

  // Función para crear URLs amigables para categorías y subcategorías
  const createCategoryUrl = (categoryName: string, subcategoryName?: string) => {
    const baseSlug = categoryName.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/gi, "")
      .replace(/\s+/g, "-");

    if (subcategoryName) {
      const subSlug = subcategoryName.toLowerCase()
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
      className={`w-full py-2 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 sticky top-0 z-50 transition-all duration-300 border-b border-gray-200/50 dark:border-gray-800/50 ${isScrolled ? "bg-background/95 shadow-lg" : "bg-background/85"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu + Logo Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden group hover:bg-accent rounded-xl transition-all duration-200 w-10 h-10"
                >
                  <Menu className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 bg-background border-r border-border p-6"
              >
                <div className="flex flex-col gap-8 mt-6">
                  <Link
                    href="/"
                    className="text-xl font-semibold hover:text-blue-600 transition-colors duration-200 font-montserrat"
                  >
                    Inicio
                  </Link>

                  {/* <CHANGE> Menú móvil completamente rediseñado - minimalista */}
                  {/* <CHANGE> Menú móvil con fondo contrastante */}
                  <div className="space-y-6">
                    {categoriesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-muted rounded"></div>
                              <div className="h-4 bg-muted rounded w-24"></div>
                            </div>
                            <div className="pl-8 space-y-2">
                              <div className="h-3 bg-muted/60 rounded w-28"></div>
                              <div className="h-3 bg-muted/60 rounded w-24"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      categories.map((category, index) => (
                        <div key={category.id} className="space-y-3">
                          {/* <CHANGE> Header con fondo gris claro/oscuro para contraste */}
                          <Link
                            href={createCategoryUrl(category.name)}
                            className="flex items-center gap-3 py-3 px-4 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                          >
                            <category.icon className="h-5 w-5 text-gray-900 dark:text-gray-100 flex-shrink-0" />
                            <div className="flex items-center gap-2 flex-1">
                              <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {category.name}
                              </span>
                              {category.featured && (
                                <span className="text-[10px] px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                          </Link>

                          {/* <CHANGE> Subcategorías con texto más oscuro */}
                          <div className="pl-8 space-y-1">
                            {category.subcategories.slice(0, 4).map((sub) => (
                              <Link
                                key={sub.id}
                                href={createCategoryUrl(category.name, sub.name)}
                                className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
                              >
                                {sub.name}
                              </Link>
                            ))}
                            {category.subcategories.length > 4 && (
                              <Link
                                href={createCategoryUrl(category.name)}
                                className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2 px-3 rounded hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors font-semibold"
                              >
                                Ver todas +{category.subcategories.length - 4}
                              </Link>
                            )}
                          </div>

                          {/* Separador */}
                          {index < categories.length - 1 && (
                            <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="flex items-center group ml-2 lg:ml-0">
              <div className="relative">
                <Image
                  src="/imgs/Logo.png"
                  alt="NEOSALE"
                  width={85}
                  height={85}
                  className="transition-all duration-300 group-hover:scale-105 filter drop-shadow-lg"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centrado */}
          <NavigationMenu className="hidden lg:flex flex-1 justify-center max-w-2xl mx-6">
            <NavigationMenuList className="gap-1 [&>li]:!bg-transparent [&>li]:!border-none [&>li]:!shadow-none">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/" className="px-5">
                    Inicio
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/products" className="px-5">
                    Productos
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-5 border-none bg-transparent hover:bg-accent/50 rounded-lg font-inter transition-all duration-300 px-5 data-[state=open]:bg-accent/50 focus:outline-none focus:ring-0 [&>svg]:!text-foreground">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent className="min-w-0 [&>div]:!bg-transparent [&>div]:!border-none [&>div]:!shadow-none [&>div]:!p-0">
                  {/* <CHANGE> Menú más dinámico y sin separadores */}
                  <div className="w-[760px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-8">
                    {categoriesLoading ? (
                      <div className="grid grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="animate-pulse space-y-4">
                            <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-16"></div>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
                              <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="text-center">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 font-medium">No hay categorías disponibles</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-8">
                        {categories.map((category) => (
                          <div key={category.id} className="relative">
                            {/* <CHANGE> Header con animaciones y efectos vibrantes */}
                            <Link
                              href={createCategoryUrl(category.name)}
                              className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 transition-all duration-300 group h-20 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5"
                            >
                              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-blue-500/30">
                                <category.icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                {/* <CHANGE> Texto con animación de color */}
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-1">
                                  {category.name}
                                </h3>
                                {category.featured && (
                                  <span className="text-[10px] px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 text-amber-700 dark:text-amber-300 rounded w-fit font-semibold shadow-sm">
                                    Popular
                                  </span>
                                )}
                              </div>
                            </Link>

                            {/* <CHANGE> Subcategorías con hover más dinámico */}
                            <div className="space-y-2">
                              {category.subcategories.slice(0, 5).map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={createCategoryUrl(category.name, sub.name)}
                                  className="block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-2.5 px-3 rounded-lg hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-850 transition-all duration-200 font-medium h-10 flex items-center truncate border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:translate-x-1 hover:shadow-sm"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                              {category.subcategories.length > 5 && (
                                <Link
                                  href={createCategoryUrl(category.name)}
                                  className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2.5 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950 dark:hover:to-indigo-950 transition-all duration-200 font-semibold h-10 flex items-center border border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm hover:shadow-blue-500/10"
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
                    className="flex h-10 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-6 py-2 text-sm font-medium text-white transition-all duration-300 hover:from-pink-600 hover:to-fuchsia-600 hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 font-inter shadow-md gap-2"
                  >
                    <Zap className="h-4 w-4 flex-shrink-0" />
                    <span>Ofertas</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/nosotros" className="px-5">
                    Nosotros
                  </NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex-1 max-w-fit hidden md:block">
            <div className="relative">
              {/*                   <SearchFilter searchTerm={filters.searchTerm} onSearchChange={(value) => updateFilter("searchTerm", value)} />
           */}

              {isSearchFocused && searchQuery.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 p-4 z-50">
                  <div className="text-sm mb-3 font-semibold font-inter">
                    Búsquedas populares:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <button
                        key={search}
                        className="px-4 py-2 bg-background text-foreground rounded-lg text-sm hover:bg-accent hover:text-blue-600 transition-all duration-200 hover:scale-105 font-inter border shadow-sm font-medium"
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
            </div>
          </div>

          {/* Actions Section - Mejor espaciado */}
          <div className="flex items-center gap-2">
            {/* ✅ Agregar relative al contenedor del botón de favoritos */}
            <div className="relative">
              <IconButton
                variant="heart"
                className="hidden md:flex w-10 h-10 ms-4"
                onClick={() => router.push("/favorites")}
              >
                <Heart className="h-5 w-5" />
              </IconButton>
              {/* ✅ Badge fuera del IconButton, dentro del contenedor relativo */}
              {favoritesCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white shadow-lg ring-2 ring-background/80 font-bold">
                  {favoritesCount}
                </Badge>
              )}
            </div>

            {/* ✅ Mantener el carrito igual - ya funciona */}
            <IconButton
              variant="cart"
              onClick={() => router.push("/productsCart")}
              className="relative w-10 h-10"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartProductCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg ring-2 ring-background/80 font-bold">
                  {cartProductCount}
                </Badge>
              )}
            </IconButton>

            <div className="ml-2">
              <ThemeToggle />
            </div>

            {userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl hover:bg-accent transition-all duration-200 cursor-pointer hover:scale-105 ml-2">
                    <div className="relative">
                      <User className="h-4 w-4" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-background shadow-sm"></div>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 rounded-xl p-3"
                >
                  <div className="p-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="font-bold font-montserrat">
                        {userProfile?.name}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={() => router.push("/profile")}
                    className="hover:bg-accent hover:text-blue-600 cursor-pointer font-inter rounded-lg p-3 font-medium mt-2"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/orders")}
                    className="hover:bg-accent hover:text-blue-600 cursor-pointer font-inter rounded-lg p-3 font-medium"
                  >
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg p-3 font-medium">
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="h-10 ml-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 font-inter shadow-md ring-1 ring-white/20 font-medium text-sm"
              >
                <span>Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Búsqueda móvil */}
      <div className="md:hidden px-4 pb-3 mt-2">
        <div className="relative">
          <SearchIcon
            onClick={handleSearchRef}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="pl-12 pr-4 w-full h-10 rounded-xl transition-all duration-200 font-inter shadow-sm bg-white/90 dark:bg-gray-800/90 border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 focus:border-blue-500/70 backdrop-blur-sm"
          />

          {isSearchFocused && searchQuery.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 z-50">
              <div className="text-sm mb-4 font-semibold font-inter text-muted-foreground">
                Búsquedas populares:
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    className="px-4 py-2 bg-card hover:bg-accent text-foreground rounded-lg text-sm hover:text-blue-600 transition-all duration-200 hover:scale-105 font-inter border border-border/50 shadow-sm font-medium"
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
        </div>
      </div>
    </nav>
  );
};
