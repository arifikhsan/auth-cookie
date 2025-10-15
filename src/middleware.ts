import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const isLoggedIn = Boolean(accessToken || refreshToken);

  const path = req.nextUrl.pathname;

  const isGuestPage = path === "/login"; // ⬅️ guest-only
  const isProtectedPage = !isGuestPage;  // ⬅️ everything else

  // 🚫 Not logged in → visiting protected page → go to /login
  if (!isLoggedIn && isProtectedPage) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Logged in → visiting /login → go to /
  if (isLoggedIn && isGuestPage) {
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  // ✅ Otherwise → allow
  return NextResponse.next();
}

// ✅ Apply middleware to all pages except static assets & API routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
