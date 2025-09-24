"use client";
import { CartProvider } from "../(customer)/(cart)/hooks/useCart";
import { UserProvider } from "../(auth)/context/UserContext";
import { FavoritesProvider } from "../(customer)/favorites/context/useFavorites";
export function UserProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <FavoritesProvider>

      <CartProvider>{children}</CartProvider>
      </FavoritesProvider>
    </UserProvider>
  );
}
