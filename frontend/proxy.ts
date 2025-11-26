import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const auth = req.cookies.get("auth")?.value;

  // Protect /task-manager and subpaths: redirect to login (/) if no auth cookie.
  if (pathname.startsWith("/task-manager")) {
    if (!auth) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Prevent authenticated users from viewing the login page at /
  if (pathname === "/" && auth) {
    return NextResponse.redirect(new URL("/task-manager", req.url));
  }

  return NextResponse.next();
}

export const proxyConfig = {
  matcher: ["/", "/task-manager/:path*"],
};
