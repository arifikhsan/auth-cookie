// app/api/login/route.ts
import { NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (password !== '1234') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const accessToken = createToken(email, 'access');
  const refreshToken = createToken(email, 'refresh');

  const res = NextResponse.json({ success: true });

  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });
  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res;
}
