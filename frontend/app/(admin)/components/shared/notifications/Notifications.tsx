"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { NotificationBell } from "../../NotificationBell";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";

export default function Notifications() {
  const { userProfile, isLoading } = useUserSafe();
  const router = useRouter();
  const staffId = userProfile?.id;

  useEffect(() => {
    if (!isLoading && !staffId) {
      router.push("/login");
    }
  }, [isLoading, staffId, router]);

  if (isLoading || !staffId) {
    return null;
  }

  return <NotificationBell staffId={staffId} />;
}
