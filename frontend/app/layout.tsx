import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import { RootProviders } from "./providers/RootProviders"; // Asegúrate de que la ruta sea correcta
import Script from "next/script";

export const userFont = Montserrat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const adminFont = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="/non-critical.css"
          media="print"
          data-non-critical="true"
        />
      </head>
      <body
        className={`${userFont.variable} ${adminFont.variable} font-montserrat antialiased @container min-h-screen`}
        suppressHydrationWarning
      >
       
        <RootProviders>
          {children}
        </RootProviders>
      </body>
    </html>
  );
}
