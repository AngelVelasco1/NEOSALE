"use client";

import {
  SearchIcon,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Zap,
  LogInIcon,
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
      className={`w-full py-2 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden group hover:bg-accent rounded-lg transition-all duration-200"
              >
                <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
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
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image
                src="/imgs/Logo.png"
                alt="NEOSALE"
                width={100}
                height={100}
                className="transition-all duration-200 group-hover:scale-105 filter drop-shadow-lg"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/">Inicio</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/products">Productos</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 border-none bg-transparent rounded-lg font-inter transition-all duration-200">
                  Categorías
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-[600px] backdrop-blur-xl shadow-2xl border rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className="group p-4 rounded-lg bg-card hover:bg-accent transition-all duration-200 border hover:shadow-md"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white shadow-md`}
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
                          <div className="space-y-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/categoria/${sub
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="block text-muted-foreground hover:text-blue-600 hover:bg-accent transition-all duration-200 p-2 rounded-md font-inter text-sm"
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
                    className="flex h-10 w-fit items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-fuchsia-500 px-5 text-sm font-medium text-white transition-all duration-200 hover:from-pink-600 hover:to-fuchsia-600 hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 font-inter shadow-md"
                  >
                    <Zap className="h-4 w-4 flex-shrink-0" />
                    <span>Ofertas</span>
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <NavLink href="/nosotros">Nosotros</NavLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Barra de búsqueda */}
          <div className="flex-1 max-w-fit hidden md:block">
            <div className="relative">
              <SearchIcon
                onClick={handleSearchRef}
                className="absolute left-7 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer"
              />
              <Input
                ref={searchRef}
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="pl-14 pr-10 h-12 w-full rounded-xl transition-all duration-200 font-inter shadow-md"
              />

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

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <IconButton variant="heart" className="hidden md:flex">
              <Heart className="h-6 w-6" />
            </IconButton>

            <IconButton
              variant="cart"
              onClick={() => router.push("/productsCart")}
              className="relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartProductCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg ring-2 ring-white/20">
                  {cartProductCount}
                </Badge>
              )}
            </IconButton>

            {/* User Account */}
            {userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-accent transition-all duration-200 cursor-pointer hover:scale-105">
                    <div className="relative">
                      <User className="h-5 w-5" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-background shadow-sm"></div>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-fit bg-card backdrop-blur-xl shadow-2xl border rounded-xl p-2"
                >
                  <div className="p-4 border-b">
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
                    className="hover:bg-accent hover:text-blue-600 cursor-pointer font-inter rounded-lg p-3 font-medium"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-accent hover:text-blue-600 cursor-pointer font-inter rounded-lg p-3 font-medium">
                    <ShoppingCart className="h-4 w-4 mr-3" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600 hover:bg-red-50 rounded-lg p-3 font-medium">
                    <SignOut />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                className="group h-11 ml-4 pr-7 gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 text-white transition-all duration-200 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 font-inter shadow-lg ring-1 ring-white/20 font-medium"
              >
                <LogInIcon className="w-0 h-0 opacity-0 group-hover:w-4 group-hover:h-4 group-hover:opacity-100 transition-all duration-200" />
                <span>Iniciar Sesión</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Búsqueda móvil */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 w-full h-12 backdrop-blur-sm rounded-xl font-inter shadow-md"
          />
        </div>
      </div>
    </nav>
  );
};