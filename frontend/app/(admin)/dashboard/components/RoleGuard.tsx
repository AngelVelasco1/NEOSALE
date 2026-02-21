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
    
    // Clear the login redirect flag since we're now on dashboard
    if (typeof window !== 'undefined') {
      const hadFlag = sessionStorage.getItem('login-redirected');
      if (hadFlag) {
        sessionStorage.removeItem('login-redirected');
      }
    }
    
    // Only check role once session is loaded
    if (status === "loading") {
      return;
    }
    
    // Prevent multiple redirects
    if (hasChecked.current) {
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
      // Don't mark as checked - let it retry
      return;
    }
    
    // If user exists, check if they have the required role
    if (session?.user) {
      const userRole = session.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        hasChecked.current = true;
        router.replace("/");
      } else {
        hasChecked.current = true;
      }
    }
  }, [session, status, router, allowedRoles]);
  
  // Show loading while checking authentication
  // This prevents flash of content before redirect
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }
  
  // Show content immediately after authentication is confirmed
  return <>{children}</>;
}
