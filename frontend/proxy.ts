import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const timestamp = new Date().toISOString();

  // Skip proxy for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/_next/webpack-hmr') ||
    pathname.startsWith('/api/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/) ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Skip proxy for prefetch/prerender requests
  const purpose = request.headers.get('purpose');
  const nextRouterPreload = request.headers.get('x-nextjs-data');
  if (purpose === 'prefetch' || nextRouterPreload) {
    console.log(`[proxy ${timestamp}] Skipping prefetch for ${pathname}`);
    return NextResponse.next();
  }

  console.log(`[proxy ${timestamp}] 🔍 Processing: ${pathname}`);

  // Check for session cookie first (faster than full auth() call)
  const sessionToken = request.cookies.get('authjs.session-token') || 
                      request.cookies.get('__Secure-authjs.session-token');
  
  console.log(`[proxy ${timestamp}] Session token: ${sessionToken ? '✅ Found' : '❌ Not found'}`);

  // Protected routes - require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/orders', '/checkout'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Admin-only routes
  const adminRoutes = ['/dashboard'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  // Auth routes (login, register, etc.)
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // 1. For auth pages with active session, let client-side handle redirect
  // Don't redirect in proxy to avoid race conditions
  if (isAuthRoute && sessionToken) {
    return NextResponse.next();
  }

  // 2. Protect admin and other routes - require session token
  if (isProtectedRoute) {
    if (!sessionToken) {
      console.log(`[proxy ${timestamp}] ❌ No session token for protected route ${pathname}, redirecting to /login`);
      const allCookies = request.cookies.getAll();
      console.log(`[proxy ${timestamp}] Available cookies:`, allCookies.map(c => c.name));
      
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[proxy ${timestamp}] ✅ Session token found: ${sessionToken.name}`);
    
    // For admin routes, role validation will happen on the client via RoleGuard
    // This prevents issues with auth() not being available during navigation
    if (isAdminRoute) {
      console.log(`[proxy ${timestamp}] Admin route - role validation delegated to client (RoleGuard)`);
    }
  }

  console.log(`[proxy ${timestamp}] ✅ Allowing access to ${pathname}`);
  return NextResponse.next();
}

// Matcher configuration - run proxy for app routes only
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - _next/webpack-hmr (webpack hot module replacement)
     * - api routes
     * - favicon.ico
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|api|favicon.ico|.*\\..*|).*)',
  ],
};

// Log when proxy file is loaded
console.log("[proxy.ts] Proxy loaded with cookie-based session check + client-side role validation");
