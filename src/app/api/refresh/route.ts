// app/api/refresh/route.ts
import { NextResponse } from "next/server";
import { verifyToken, createToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST() {
  const refresh = (await cookies()).get("refresh_token")?.value;
  //   const refresh = req.headers.get('cookie').get('refresh_token');
  const refreshData = verifyToken(refresh, "refresh");

  if (!refreshData) {
    // 🚫 Instead of returning 401, we send 200 with an error message
    return NextResponse.json(
      { success: false, message: "Refresh token invalid or expired" },
      { status: 200 } // Always 200 to suppress red errors
    );
  }

  // ✅ Refresh token valid → issue new pair
  const newAccess = createToken(refreshData.email, "access");
  const newRefresh = createToken(refreshData.email, "refresh");

  const res = NextResponse.json({
    success: true,
    message: "Access token refreshed",
  });

  res.cookies.set("access_token", newAccess, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  res.cookies.set("refresh_token", newRefresh, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
