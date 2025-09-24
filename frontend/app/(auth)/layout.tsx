import React from "react";
import { Navbar } from "../components/Navbar";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "../(customer)/(cart)/hooks/useCart";
import { FavoritesProvider } from "../(customer)/favorites/context/useFavorites";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
        <FavoritesProvider>
        <CartProvider>
          <div className="min-h-screen w-full flex flex-col font-inter">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </CartProvider>
    </FavoritesProvider>
      </UserProvider>
  );
}
