import { auth } from "@/app/(auth)/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // ==========================================
  // PROTECCIÓN PARA ADMINS
  // ==========================================
  if (session?.user?.role === "admin") {
    // Rutas de clientes que admins NO pueden acceder
    const customerOnlyRoutes = [
      "/",
      "/products",
      "/category",
      "/subcategory",
      "/orders", // Pedidos de cliente
      "/cart", // Carrito
      "/checkout", // Checkout
      "/favorites", // Favoritos
      "/profile", // Perfil de cliente
      "/login",
      "/register",
    ];

    const isCustomerRoute = customerOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    // Redirigir admin a dashboard si intenta acceder a rutas de clientes
    if (isCustomerRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // ==========================================
  // PROTECCIÓN PARA USUARIOS NO AUTENTICADOS
  // ==========================================
  if (!session || !session.user) {
    const privateRoutes = ["/profile", "/orders", "/checkout", "/favorites"];
    const isPrivateRoute = privateRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ==========================================
  // PROTECCIÓN DEL DASHBOARD (Solo admins)
  // ==========================================
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
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
