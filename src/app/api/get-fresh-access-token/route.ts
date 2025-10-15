// app/api/get-fresh-access-token/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decodeJwt } from "@/lib/auth"; // assume you have this

export async function GET() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const accessToken = cookieStore.get("access_token")?.value;
  console.log("accessToken: ", accessToken);

  if (!accessToken) {
    return NextResponse.json({
      success: false,
      message: "No access token found",
      accessToken: null,
    });
  }

  try {
    // ✅ Check expiration
    const payload = decodeJwt(accessToken);
    const now = Math.floor(Date.now() / 1000);

    // If token expires in <60s → refresh
    if (payload.exp && payload.exp - now < 60) {
      console.log("🔄 Access token about to expire, refreshing...");
      const refreshRes = await fetch(`http://localhost:3000/api/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          Cookie: cookieHeader, // ⬅️ forward cookies manually
        },
      });
      const refreshData = await refreshRes.json();

      if (!refreshData.success) {
        // ❌ Refresh failed — clear cookies
        const response = NextResponse.json({
          success: false,
          message: "Refresh failed, logged out",
        });
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");

        return response;
      }

      // ✅ Success — return refreshed token
      return NextResponse.json({
        success: true,
        message: "Token refreshed",
        accessToken: refreshData.accessToken,
      });
    }

    // ✅ Still valid
    return NextResponse.json({
      success: true,
      message: "Token still valid",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    const response = NextResponse.json({
      success: false,
      message: "Invalid token",
      accessToken: null,
    });
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }
}
