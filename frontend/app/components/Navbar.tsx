import Image from "next/image"
import { Input } from "../../components/ui/input";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export const Navbar = () => {
  const pages = [
    {
      name: "Inicio",
      url: "/",
    },
    {
      name: "Productos",
      url: "/products",
    },
    {
      name: "Nosotros",
      url: "#",
    },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image src="/logo.png" alt="NEOSALE" width={120} height={40} className="h-10 w-auto" />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {pages.map((page, index) => (
                  <a
                    key={index}
                    href={page.url}
                    className="text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    {page.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    className="w-64 pl-10 pr-4 py-2 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-purple-600">
                <Heart className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-purple-600 relative">
                <ShoppingCart className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                  2
                </Badge>
              </Button>

              <Button variant="ghost" size="icon" className="text-gray-700 hover:text-purple-600">
                <User className="h-5 w-5" />
              </Button>

          
            </div>
          </div>
        </div>
      </nav>
  );
};
