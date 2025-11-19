"use client";

import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/(admin)/components/ui/popover";
import { Button } from "@/app/(admin)/components/ui/button";
import { ScrollArea } from "@/app/(admin)/components/ui/scroll-area";
import NotificationsBadge from "./NotificationsBadge";
import NotificationContent from "./NotificationContent";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";

export default function Notifications() {
  const { userProfile, isLoading } = useUserSafe();
  const router = useRouter();
  const staffId = userProfile?.id?.toString();

  useEffect(() => {
    if (!isLoading && !staffId) {
      router.push("/login");
    }
  }, [isLoading, staffId, router]);

  if (isLoading || !staffId) {
    return null;
  }

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 group hover:scale-105"
          >
            <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          alignOffset={-5}
          className="flex flex-col p-0 w-[18rem] sm:w-[22rem] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl"
          sideOffset={8}
        >
          <ScrollArea type="auto" className="h-full max-h-[22rem]">
            <NotificationContent staffId={staffId} />
          </ScrollArea>
        </PopoverContent>
      </Popover>

      <NotificationsBadge staffId={staffId} />
    </div>
  );
}
