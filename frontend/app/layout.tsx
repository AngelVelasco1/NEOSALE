import type { Metadata } from "next";
import "./styles/globals.css";
import { Poppins, PT_Sans_Caption } from "next/font/google";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartProvider } from "./(cart)/hooks/useCart";
import React from 'react';
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./(auth)/context/UserContext";

const sourceSans = PT_Sans_Caption({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NeoSale",
  description:
    "Ecommerce para empresas de ventas, con un enfoque en la experiencia del usuario y la facilidad de uso.",
};

export const colors = {
  primary: "#A18A68",
  text: "#3B3B3A",
  black: "#000",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans.className} `}>

        <SessionProvider>
        <UserProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
        </UserProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
