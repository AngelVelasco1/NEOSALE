"use client";

import Image from "next/image"
import { Input } from "../../components/ui/input";
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, User, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
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
    }
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Image src="/imgs/Logo.png" alt="NEOSALE" width={110} height={110} />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8 ">
              {pages.map((page, index) => (
                <a
                  key={index}
                  href={page.url}
                  className="text-gray-900 hover:text-purple-600 px-3 py-2 text-base font-medium transition-colors"
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
            {session ? (
              <>
                <span className="text-md text-blue-600 font-bold">Hola, {session.user.name}</span>
                <Button onClick={() => router.push('/profile')} variant="ghost" size="icon">
                  <User width={20} height={20} />
                </Button>
              </>
            ) : (
              <Button onClick={() => router.push('/login')} variant="ghost" size="icon">
                <User width={20} height={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
