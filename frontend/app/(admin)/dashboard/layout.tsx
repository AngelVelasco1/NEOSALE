import { cookies } from "next/headers";

import Header from "@/app/(admin)/components/shared/header";
import Container from "@/app/(admin)/components/ui/container";
import AppSidebar from "@/app/(admin)/components/shared/sidebar/AppSidebar";
import { SidebarProvider } from "@/app/(admin)/components/ui/sidebar";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <div className="flex flex-col flex-grow min-w-0">
        <Header />

        <main className="pt-6 pb-8 flex-grow print:!py-0">
          <Container>{children}</Container>
        </main>
      </div>
    </SidebarProvider>
  );
}
