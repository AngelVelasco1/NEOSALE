"use client";

import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  ChevronDown,
  Zap,
  LogInIcon,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
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
import { useUser } from "../(auth)/context/UserContext";
import { SignOut } from "../(auth)/components/SingOut";
import { useRouter } from "next/navigation";

const categories = [
  {
    name: "Electrónicos",
    icon: "📱",
    featured: true,
    subcategories: ["Smartphones", "Laptops", "Tablets", "Accesorios", "Audio"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Moda",
    icon: "👕",
    featured: false,
    subcategories: [
      "Ropa Hombre",
      "Ropa Mujer",
      "Zapatos",
      "Accesorios",
      "Relojes",
    ],
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Hogar",
    icon: "🏠",
    featured: true,
    subcategories: [
      "Muebles",
      "Decoración",
      "Cocina",
      "Jardín",
      "Electrodomésticos",
    ],
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Deportes",
    icon: "⚽",
    featured: false,
    subcategories: [
      "Fitness",
      "Outdoor",
      "Deportes de Equipo",
      "Ropa Deportiva",
    ],
    color: "from-orange-500 to-red-500",
  },
];

const trendingSearches = [
  "iPhone 15",
  "MacBook Pro",
  "Nike Air Max",
  "Samsung TV",
  "PlayStation 5",
];

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const { userProfile } = useUser();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-md  border-purple-100 sticky top-0 z-50">
      {/* Main Navbar with Glass Effect */}
      <header
        className={`bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 transition-all duration-500 ${
          isScrolled ? "shadow-lg shadow-blue-500/10" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Mobile Menu with Animation */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden group">
                  <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-100 bg-gradient-to-b from-white to-blue-50"
              >
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="text-lg font-semibold hover:text-blue-600 transition-colors duration-300"
                  >
                    Inicio
                  </Link>
                  <div className="space-y-4">
                    {categories.map((category, index) => (
                      <div
                        key={category.name}
                        className="animate-in slide-in-from-left duration-300"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <h3 className="font-medium text-gray-900">
                            {category.name}
                          </h3>
                          {category.featured && (
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <div className="pl-8 space-y-2">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub}
                              href={`/categoria/${sub.toLowerCase()}`}
                              className="block text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-2"
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

            {/* Refined Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex flex-col">
                <div className="flex-shrink-0">
                  <Image
                    src="/imgs/Logo.png"
                    alt="NEOSALE"
                    width={110}
                    height={110}
                  />
                </div>
              </div>
            </Link>

            {/* Refined Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-md font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      Inicio
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-md font-medium transition-colors hover:bg-blue-50 hover:text-blue-600 focus:bg-accent focus:text-accent-foreground focus:outline-none"
                    >
                      Productos
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 hover:bg-blue-50 hover:text-blue-600 border-none border-0">
                    Categorías
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[700px] grid-cols-2 gap-4 p-4 bg-white/90 border-none border-0">
                      {categories.map((category) => (
                        <div
                          key={category.name}
                          className="space-y-3 p-3 rounded-lg hover:bg-gray-50 transition-colors 
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${category.color} text-white text-sm`}
                            >
                              {category.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {category.name}
                              </h3>
                              {category.featured && (
                                <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/categoria/${sub
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-sm text-gray-600 hover:text-blue-600 transition-colors p-1 rounded hover:bg-blue-50"
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/ofertas"
                      className="inline-flex h-9 items-center justify-center rounded-md bg-gradient-to-r from-red-500 to-pink-500 px-4 text-sm font-medium text-white transition-all hover:from-red-600 hover:to-pink-600 hover:shadow-md"
                    >
                      {/* ✅ Contenedor flex interno para aislar el layout */}
                      <span className="flex items-center">
                        <Zap className="h-4 w-4 mr-1" />
                        <span>Ofertas</span>
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/nosotros"
                      className="inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-blue-50 hover:text-blue-600"
                    >
                      Nosotros
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Improved Search Bar */}
            <div className="flex-1 max-w-lg mx-8  hidden md:block">
              <div className="relative w-11/12  mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() =>
                    setTimeout(() => setIsSearchFocused(false), 200)
                  }
                  className="pl-10 pr-4 h-10 w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200 bg-white placeholder:text-gray-500"
                />
                {isSearchFocused && searchQuery.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-50">
                    <div className="text-sm text-gray-600 mb-2">
                      Búsquedas populares:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search) => (
                        <button
                          key={search}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
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

            {/* Refined Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex h-9 w-9 hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                <Heart className="h-4 w-4" />
              </Button>

              {/* Shopping Cart */}
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-blue-600 text-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {/* User Account */}
              {userProfile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-2 h-9 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="relative">
                        <User className="h-5 w-5" size={25} />
                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                      </div>
                      <ChevronDown className="h-3 w-3" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-fit px-3 py-2 bg-white shadow-2xl shadow-black/80 rounded-lg"
                  >
                    <div className="p-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {userProfile?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {userProfile?.name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                      className="text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Mi Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 cursor-pointer">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Mis Pedidos
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 ">
                      <SignOut />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                      <Button
                  onClick={() => router.push("/login")}
                  className="group h-10 pe-6 ms-4 gap-2 w-fit rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-300 ease-out "
                >
                  <div className="flex items-center gap-0 transition-all duration-300 ease-out">
                    <LogInIcon className="w-0 h-0 p-0 opacity-0 scale-0 group-hover:w-4 group-hover:opacity-100 group-hover:scale-100 group-hover:mr-2 transition-all duration-300 ease-out" />
                    <span className="whitespace-nowrap">Iniciar Sesión</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Improved Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 w-full h-10 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg bg-white placeholder:text-gray-500"
            />
          </div>
        </div>
      </header>
    </div>
  );
};
