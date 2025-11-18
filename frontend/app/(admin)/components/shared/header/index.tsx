import { Suspense } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Profile from "@/app/(admin)/components/shared/header/Profile";
import ThemeToggle from "@/app/(admin)/components/shared/header/ThemeToggle";
import Notifications from "@/app/(admin)/components/shared/notifications/Notifications";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4 bg-background">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="h-9 w-9"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-x-2 ml-auto">
        <ThemeToggle />
        <Suspense fallback={<div className="w-9 h-9" />}>
          <Notifications />
        </Suspense>
        <Suspense fallback={<div className="w-9 h-9 rounded-full bg-muted" />}>
          <Profile />
        </Suspense>
      </div>
    </header>
  );
}
