import React from "react";
import { Navbar } from "../components/Navbar";
import { Montserrat } from "next/font/google";
import { UserProvider } from "./context/UserContext";
import { Toaster } from "sonner";

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
        <UserProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "white",
                  border: "1px solid #e5e7eb",
                  color: "#374151",
                },
              }}
              closeButton
              richColors
            />
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
