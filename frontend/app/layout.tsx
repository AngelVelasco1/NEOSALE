import React from "react";
import type { Metadata } from "next";
import "./styles/globals.css";
import { Montserrat } from "next/font/google";
import { RootProviders } from "./providers/RootProviders";

export const generalFont = Montserrat({
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
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${generalFont.className} `}>
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
