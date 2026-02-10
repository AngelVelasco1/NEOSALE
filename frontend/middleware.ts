import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // TODO: Re-enable auth() once Prisma module import issues are fixed
  // const session = await auth();

  // Performance headers
  const response = NextResponse.next();
  
  if (!pathname.startsWith("/api") && !pathname.startsWith("/dashboard")) {
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
  }
  
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
