import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Montserrat } from "next/font/google";
import { UserProviders } from "../providers/UserProviders";

const userFont = Montserrat({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${userFont.className} `}>
        <UserProviders>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </UserProviders>
      </body>
    </html>
  );
}
