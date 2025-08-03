import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, Poppins } from "next/font/google";
import { RootProviders } from "./providers/RootProviders";
import { ThemeProvider } from "@/components/ThemeProvider";
export const userFont = Montserrat({
  weight: ["300", "400", "500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const adminFont = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
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
      <body
        className={`${userFont.variable} ${adminFont.variable} font-montserrat antialiased`}
      >
         <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

        <RootProviders>{children}</RootProviders>
         </ThemeProvider>
      </body>
    </html>
  );
}
