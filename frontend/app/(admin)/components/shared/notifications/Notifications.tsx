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
          <Button variant="ghost" size="icon">
            <Bell />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          alignOffset={-60}
          asChild
          className="flex flex-col p-0 w-[18rem] sm:w-[22rem]"
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
