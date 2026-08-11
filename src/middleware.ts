import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  
  // Fast-path: skip JWT for public routes (HUGE perf win — avoids 200-500ms crypto per request)
  const isPublicPage =
    nextUrl.pathname === "/" ||
    nextUrl.pathname === "/403" ||
    nextUrl.pathname === "/terms-and-conditions";
  const isPublicApi =
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.startsWith("/api/events") ||
    nextUrl.pathname.startsWith("/api/sponsors") ||
    nextUrl.pathname.startsWith("/api/resources");
    
  if (isPublicPage || isPublicApi) return NextResponse.next();

  // Only decrypt JWT for protected routes
  const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "eureka-secret-2026-key";
  const isSecure = nextUrl.protocol === "https:";

  const token = await getToken({ 
    req, 
    secret,
    secureCookie: isSecure,
  }).catch(() => null);
  
  const isLoggedIn = !!token;
  const userRole = token?.role as string | undefined;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register");
  const isAdminApiRoute = nextUrl.pathname.startsWith("/api/admin");

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Protect dashboard routes
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`, nextUrl)
    );
  }

  // Protect admin routes
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", nextUrl));
    }
  }

  // Protect admin API routes
  if (isAdminApiRoute) {
    if (!isLoggedIn || userRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Access denied" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
