// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const accessData = req.cookies.get('access_token')?.value;
  const refreshData = req.cookies.get('refresh_token')?.value;

  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  // Redirect to /login if no tokens and not already there
  if (!accessData && !refreshData && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all app routes except /login
  matcher: ['/((?!login|api|_next/static|_next/image|favicon.ico).*)'],
};
