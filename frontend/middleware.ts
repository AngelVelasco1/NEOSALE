import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Si es admin y trata de acceder a rutas públicas/auth
  if (session?.user?.role === "admin") {
    const publicRoutes = ["/", "/products", "/about", "/contact", "/login", "/register"];
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(route + "/")
    );

    if (isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Si no es admin y trata de acceder al dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
