import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/server/auth/constants";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!request.cookies.has(SESSION_COOKIE)) {
    const login = request.nextUrl.clone();
    login.pathname = "/sign-in";
    login.searchParams.set("next", `${path}${request.nextUrl.search}`);
    if (path.startsWith("/admin") || path.startsWith("/super-admin")) login.searchParams.set("mode", "admin");
    return NextResponse.redirect(login);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/super-admin/:path*"]
};
