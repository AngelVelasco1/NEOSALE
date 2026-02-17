import { auth } from "@/app/(auth)/auth";

/**
 * Get authentication credentials from session
 * Returns token in format: "userId:role" for use with backend
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const session = await auth();

    if (!session?.user) {
      return null;
    }

    const userId = session.user.id || "";
    const role = (session.user as any).role || "user";

    // Format: "userId:role"
    return `${userId}:${role}`;
  } catch (error) {
    console.error("[getAuthToken] Error:", error);
    return null;
  }
}

/**
 * Verify user is authenticated and has required role(s)
 */
export async function requireAuth(...requiredRoles: string[]): Promise<{
  userId: string;
  role: string;
}> {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized: No session found");
  }

  const role = (session.user as any).role || "user";
  const userId = session.user.id || "";

  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    throw new Error(
      `Forbidden: Required role(s): ${requiredRoles.join(", ")}, got: ${role}`
    );
  }

  return { userId, role };
}

/**
 * Verify user is admin
 */
export async function requireAdmin() {
  return requireAuth("admin");
}
