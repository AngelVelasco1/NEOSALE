import React from "react";
import { Navbar } from "../components/Navbar";
import { UserProvider } from "./context/UserContext";


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <div className="min-h-screen w-full flex flex-col font-inter">
        <Navbar />
        <main className="flex-grow">{children}</main>
      </div>
    </UserProvider>
  );
}
