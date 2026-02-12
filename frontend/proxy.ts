import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get('authjs.session-token') || 
                      request.cookies.get('__Secure-authjs.session-token');

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

  if (isAuthRoute && !sessionToken) {
    return NextResponse.next();
  }

  // 2. Protect admin and other routes - require session token
  if (isProtectedRoute) {
    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Matcher configuration - run proxy for app routes only
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|_next/webpack-hmr|api|favicon.ico|.*\\..*|).*)',
  ],
};
