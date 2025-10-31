import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { useSession } from "next-auth/react";

// Tipos de roles basados en Prisma
type UserRole = "user" | "admin";

const permissions = {
  orders: {
    canChangeStatus: ["admin"],
    canPrint: ["admin"],
  },
  categories: {
    canCreate: ["admin"],
    canDelete: ["admin"],
    canEdit: ["admin"],
    canTogglePublished: ["admin"],
  },
  coupons: {
    canCreate: ["admin"],
    canDelete: ["admin"],
    canEdit: ["admin"],
    canTogglePublished: ["admin"],
  },
  customers: {
    canDelete: ["admin"],
    canEdit: ["admin"],
  },
  products: {
    canCreate: ["admin"],
    canDelete: ["admin"],
    canEdit: ["admin"],
    canTogglePublished: ["admin"],
  },
  staff: {
    canDelete: ["admin"],
    canEdit: ["admin"],
    canTogglePublished: ["admin"],
  },
} as const;

type PermissionMap = typeof permissions;
type Feature = keyof PermissionMap;

export function useAuthorization() {
  const { data: session } = useSession();
  const { isLoading } = useUserSafe();

  const hasPermission = <F extends Feature>(
    feature: F,
    action: keyof PermissionMap[F]
  ): boolean => {
    if (isLoading || !session?.user) return false;

    // Obtener el rol del usuario desde la sesión de NextAuth
    const userRole = (session.user as any).role as UserRole;
    
    if (!userRole) return false;

    const allowedRoles = permissions[feature][action];
    return (allowedRoles as UserRole[]).includes(userRole);
  };

  const isSelf = (userId: string) => {
    return session?.user?.id === userId;
  };

  return { hasPermission, isSelf, isLoading };
}

export type HasPermission = ReturnType<
  typeof useAuthorization
>["hasPermission"];
export type IsSelf = ReturnType<typeof useAuthorization>["isSelf"];
