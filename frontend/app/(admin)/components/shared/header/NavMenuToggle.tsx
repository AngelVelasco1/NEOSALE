"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/app/(admin)/components/ui/sidebar";

export default function NavMenuToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-9 w-9"
      aria-label="Toggle sidebar"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
