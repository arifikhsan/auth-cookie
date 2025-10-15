// app/api/me/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export async function GET() {
  const access = (await cookies()).get('access_token')?.value;
  const data = verifyToken(access, 'access');

  if (!data) {
    // ⛔ Access token invalid or expired
    return NextResponse.json(
      {
        success: false,
        message: 'Access token expired or invalid',
        user: null,
      },
      { status: 200 } // ✅ Always return 200
    );
  }

  // ✅ Access token valid
  return NextResponse.json(
    {
      success: true,
      user: { email: data.email },
      message: 'User authenticated',
    },
    { status: 200 }
  );
}
