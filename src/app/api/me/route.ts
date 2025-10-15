// app/api/me/route.ts
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export async function GET() {
  const freshResponse = await fetch(`http://localhost:3000/api/get-fresh-access-token`, {
    method: "GET",
    credentials: "include",
  });

  console.log('freshResponse: ', freshResponse)

  const freshToken = await freshResponse.json();

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
