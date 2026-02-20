import React from "react";
import { ClientLayout } from "./ClientLayout";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
