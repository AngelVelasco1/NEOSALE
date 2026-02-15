import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip public/static assets
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  try {
    // Get token from request - this works in middleware/proxy
    const token = await getToken({ 
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
    });

    const userRole = (token as any)?.role as string | undefined;
    const isAdmin = userRole === 'admin';
    const customerOnlyRoutes = ['/checkout', '/orders', '/profile', '/favorites', '/productsCart'];
    const isCustomerRoute = customerOnlyRoutes.some(route => pathname.startsWith(route));


    // If user is admin - block customer-only routes
    if (isAdmin && token) {
      if (isCustomerRoute) {
        // Admin trying to access customer-only route - REDIRECT to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      // Admin accessing public/allowed routes - ALLOW
      return NextResponse.next();
    }

    // If user is trying to access customer-only routes without proper auth
    if (isCustomerRoute) {
      if (!token || userRole !== 'user') {
        // Not authenticated or wrong role - REDIRECT to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // All other paths - ALLOW
    return NextResponse.next();
  } catch (error) {
    // On error, allow the request to continue (fail open)
    console.error('❌ PROXY ERROR:', error);
    return NextResponse.next();
  }
}

// Matcher configuration - run proxy for app routes only
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
