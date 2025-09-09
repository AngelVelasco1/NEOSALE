"use client";
import { CartProvider } from "../(customer)/(cart)/hooks/useCart";
import { UserProvider } from "../(auth)/context/UserContext";

export function UserProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <CartProvider>{children}</CartProvider>
    </UserProvider>
  );
}
