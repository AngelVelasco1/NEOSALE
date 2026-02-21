import React from "react";
import { ConditionalClientLayout } from "./components/ConditionalClientLayout";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // UserProvider is already in RootProviders - don't double-wrap
  return (
    <ConditionalClientLayout>
      {children}
    </ConditionalClientLayout>
  );
}
