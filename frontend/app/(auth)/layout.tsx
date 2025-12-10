import React from "react";
import { UserProvider } from "./context/UserContext";
import { ConditionalClientLayout } from "./components/ConditionalClientLayout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <ConditionalClientLayout>
        {children}
      </ConditionalClientLayout>
    </UserProvider>
  );
}
