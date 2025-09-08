"use client";

import {
  SearchIcon,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Zap,
  Smartphone,
  Shirt,
  Home,
  Dumbbell,
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
import { useCart } from "../(user)/(cart)/hooks/useCart";
import { ThemeToggle } from "./ThemeToggle";
import { SearchFilter } from "../(user)/(products)/components/filters/SearchFilter";

const categories = [
  {
    name: "Electrónicos",
    icon: Smartphone,
    featured: true,
    subcategories: ["Smartphones", "Laptops", "Tablets", "Accesorios", "Audio"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Moda",
    icon: Shirt,
    featured: false,
    subcategories: [
      "Ropa Hombre",
      "Ropa Mujer",
      "Zapatos",
      "Accesorios",
      "Relojes",
    ],
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Hogar",
    icon: Home,
    featured: true,
    subcategories: [
      "Muebles",
      "Decoración",
      "Cocina",
      "Jardín",
      "Electrodomésticos",
    ],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Deportes",
    icon: Dumbbell,
    featured: false,
    subcategories: [
      "Fitness",
      "Outdoor",
      "Deportes de Equipo",
      "Ropa Deportiva",
    ],
    color: "from-purple-500 to-indigo-500",
  },
];

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
  const [isScrolled, setIsScrolled] = useState(false);
  const { userProfile } = useUserSafe();
  const mounted = useMounted();
  const searchRef = useRef<HTMLInputElement>(null);

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

  return (
    <nav
      className={`w-full py-2 backdrop-blur-2xl bg-white/60 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80" : "bg-background/60"
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
              <SheetContent side="left" className="w-80 backdrop-blur-xl border-r">
                <div className="flex flex-col gap-6 mt-8">
                  <Link
                    href="/"
                    className="text-xl font-semibold hover:text-blue-600 transition-colors duration-200 font-montserrat"
                  >
                    Inicio
                  </Link>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div key={category.name}>
                        <div className="flex items-center gap-3 mb-3">
                          <category.icon className="h-6 w-6 text-blue-500" />
                          <h3 className="font-semibold font-montserrat text-lg">
                            {category.name}
                          </h3>
                          {category.featured && (
                            <Badge
                              className={`bg-gradient-to-r ${category.color} text-white text-xs shadow-lg`}
                            >
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="pl-9 space-y-1">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              href={`/categoria/${sub.toLowerCase()}`}
                              className="block text-muted-foreground hover:text-blue-600 transition-all duration-200 hover:translate-x-2 font-inter text-sm py-1"
                            >
                              {sub}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
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
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/" className="px-5">Inicio</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/products" className="px-5">Productos</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 border-none bg-transparent hover:bg-accent rounded-xl font-inter transition-all duration-200 px-5">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[650px] backdrop-blur-xl shadow-2xl border rounded-2xl p-6 bg-background/95">
                    <div className="grid grid-cols-2 gap-6">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className="group p-5 rounded-xl bg-card/50 hover:bg-accent/80 transition-all duration-300 border border-border/50 hover:shadow-lg hover:border-border"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div
                              className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                            >
                              <category.icon className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-bold font-montserrat text-base group-hover:text-blue-600 transition-colors">
                                {category.name}
                              </h3>
                              {category.featured && (
                                <Badge
                                  className={`bg-gradient-to-r ${category.color} text-white text-xs mt-1 shadow-sm`}
                                >
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/categoria/${sub
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="block text-muted-foreground hover:text-blue-600 hover:bg-accent/50 transition-all duration-200 p-2.5 rounded-lg font-inter text-sm hover:translate-x-1"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
                  <NavLink href="/nosotros" className="px-5">Nosotros</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex-1 max-w-fit hidden md:block">
            <div className="relative">
{/*                   <SearchFilter searchTerm={filters.searchTerm} onSearchChange={(value) => updateFilter("searchTerm", value)} />
 */}            

              {isSearchFocused && searchQuery.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card backdrop-blur-xl rounded-xl shadow-2xl border p-4 z-50">
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
            <IconButton variant="heart" className="hidden md:flex w-10 h-10 ms-4">
              <Heart className="h-5 w-5" />
            </IconButton>

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
                  className="w-64 bg-background/95 backdrop-blur-xl shadow-2xl border border-border/50 rounded-xl p-3"
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
                  <DropdownMenuItem className="hover:bg-accent hover:text-blue-600 cursor-pointer font-inter rounded-lg p-3 font-medium">
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
            className="pl-12 pr-4 w-full h-10 rounded-xl transition-all duration-200 font-inter shadow-sm bg-background/80 border-border/50 hover:border-border focus:border-blue-500/50 backdrop-blur-sm"
          />

          {isSearchFocused && searchQuery.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50 p-5 z-50">
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