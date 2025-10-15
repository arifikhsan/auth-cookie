// app/api/me/route.ts
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  // 1️⃣ Check if tokens exist at all
  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      {
        success: false,
        message: "No access token",
        user: null,
      },
      { status: 200 }
    );
  }
  
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const freshResponse = await fetch(`${process.env.APP_URL}/api/get-fresh-access-token`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: cookieHeader, // ⬅️ forward cookies manually
    },
  });


  const freshToken = await freshResponse.json();
  console.log('freshToken: ', freshToken)

  if (!freshToken || !freshToken.success) {
    // ⛔ Access token invalid or expired
    return NextResponse.json(
      {
        success: false,
        message: "Access token expired or invalid",
        user: null,
      },
      { status: 200 } // ✅ Always return 200
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = jwtDecode(freshToken.accessToken)

  // ✅ Access token valid
  return NextResponse.json(
    {
      success: true,
      user: { email: payload.email },
      message: "User authenticated",
    },
    { status: 200 }
  );
}
