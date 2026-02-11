"use client";

import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { NotificationBell } from "../../NotificationBell";

export default function Notifications() {
  const { userProfile, isLoading } = useUserSafe();
  const staffId = userProfile?.id;

  // Don't redirect here - auth is already handled by proxy.ts and RoleGuard
  // This component can just return null while loading or if no user
  if (isLoading || !staffId) {
    return null;
  }

  return <NotificationBell staffId={staffId} />;
}
