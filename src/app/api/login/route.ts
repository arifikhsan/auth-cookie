// app/api/login/route.ts
import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (password !== "1234") {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const accessToken = createToken(email, "access");
  const refreshToken = createToken(email, "refresh");

  const res = NextResponse.json({ success: true });

  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    domain: isProd ? "auth-cookie-wine.vercel.app" : undefined,
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProd,
    domain: isProd ? "auth-cookie-wine.vercel.app" : undefined,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
