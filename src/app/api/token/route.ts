// app/api/token/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value || null;

  return NextResponse.json({ accessToken });
}
