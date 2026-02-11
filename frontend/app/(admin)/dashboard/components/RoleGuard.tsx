"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const hasChecked = useRef(false);
  
  useEffect(() => {
    console.log(`[RoleGuard] status: ${status}, session:`, session, `hasChecked: ${hasChecked.current}`);
    
    // Clear the login redirect flag since we're now on dashboard
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('login-redirected');
    }
    
    // Only check role once session is loaded
    if (status === "loading") {
      console.log("[RoleGuard] Status loading, waiting...");
      return;
    }
    
    // Prevent multiple redirects
    if (hasChecked.current) {
      console.log("[RoleGuard] Already checked, skipping");
      return;
    }
    
    // IMPORTANT: Don't redirect to /login here!
    // Middleware already checked authentication (sessionToken exists)
    // If user reaches this point, they HAVE a session.
    // We only check ROLE here, not authentication.
    
    // If status is unauthenticated but user reached here, 
    // it means session is still loading or there's a brief race condition
    // Just wait for session to load properly
    if (status === "unauthenticated") {
      console.log("[RoleGuard] Status unauthenticated (likely race condition), waiting for session to load...");
      // Don't mark as checked - let it retry
      return;
    }
    
    // If user exists, check if they have the required role
    if (session?.user) {
      const userRole = session.user.role;
      if (!allowedRoles.includes(userRole)) {
        hasChecked.current = true;
        console.log(`[RoleGuard] User role '${userRole}' not in allowed roles [${allowedRoles.join(', ')}], redirecting to /`);
        router.replace("/");
      } else {
        hasChecked.current = true;
        console.log(`[RoleGuard] Access granted ✅ (role: ${userRole})`);
      }
    }
  }, [session, status, router, allowedRoles]);
  
  // Show content immediately (middleware already checked auth)
  return <>{children}</>;
}
