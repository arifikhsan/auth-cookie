import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, createToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const access = req.cookies.get('access_token')?.value;
  const refresh = req.cookies.get('refresh_token')?.value;
  const { pathname } = req.nextUrl;

  const accessData = verifyToken(access, 'access');
  const refreshData = verifyToken(refresh, 'refresh');

  // If visiting /dashboard and access expired, try to auto-refresh
  if (pathname.startsWith('/dashboard') && !accessData && refreshData) {
    const newAccess = createToken(refreshData.email, 'access');
    const newRefresh = createToken(refreshData.email, 'refresh');

    const res = NextResponse.next();
    res.cookies.set('access_token', newAccess, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    res.cookies.set('refresh_token', newRefresh, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return res;
  }

  // If visiting /dashboard and no valid tokens, redirect to login
  if (pathname.startsWith('/dashboard') && !accessData && !refreshData) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If visiting /login and already logged in → redirect to dashboard
  if (pathname.startsWith('/login') && accessData) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard'],
};
