// app/api/get-fresh-access-token/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decodeJwt } from '@/lib/auth'; // assume you have this

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('access_token')?.value;
  console.log('accessToken: ', accessToken)

  if (!accessToken) {
    return NextResponse.json({
      success: false,
      message: 'No access token found',
      accessToken: null,
    });
  }

  try {
    // ✅ Check expiration
    const payload = decodeJwt(accessToken);
    const now = Math.floor(Date.now() / 1000);

    // If token expires in <60s → refresh
    if (payload.exp && payload.exp - now < 60) {
      console.log('🔄 Access token about to expire, refreshing...');
      const refreshRes = await fetch(`http://localhost:3000/api/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      const refreshData = await refreshRes.json();

      if (refreshData.success) {
        return NextResponse.json({
          success: true,
          message: 'Token refreshed',
          accessToken: refreshData.accessToken,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Refresh failed',
          accessToken: null,
        });
      }
    }

    // ✅ Still valid
    return NextResponse.json({
      success: true,
      message: 'Token still valid',
      accessToken,
    });
  } catch (err) {
    console.log(err)
    return NextResponse.json({
      success: false,
      message: 'Invalid token',
      accessToken: null,
    });
  }
}
