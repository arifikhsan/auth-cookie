// lib/auth.ts

import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_SECRET = 'access_secret_key';
const REFRESH_TOKEN_SECRET = 'refresh_secret_key';

export function createToken(email: string, type: 'access' | 'refresh') {
  const payload = { email };

  const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  const expiresIn = type === 'access' ? '15m' : '7d'; // short-lived access, longer refresh

  return jwt.sign(payload, secret, { expiresIn });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJwt(token: string): any {
  return jwtDecode(token)
}

// const ACCESS_TOKEN_LIFETIME = 10 * 1000; // 10s for demo
// const REFRESH_TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

// export function createToken(email: string, type: "access" | "refresh") {
//   const exp =
//     Date.now() +
//     (type === "access" ? ACCESS_TOKEN_LIFETIME : REFRESH_TOKEN_LIFETIME);
//   return Buffer.from(JSON.stringify({ email, exp, type })).toString("base64");
// }

// export function verifyToken(
//   token?: string,
//   expectedType?: "access" | "refresh"
// ) {
//   if (!token) return null;
//   try {
//     const data = JSON.parse(Buffer.from(token, "base64").toString());
//     if (expectedType && data.type !== expectedType) return null;
//     if (Date.now() > data.exp) return null;
//     return data;
//   } catch {
//     return null;
//   }
// }

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function decodeJwt(token: string): any {
//   return JSON.parse(Buffer.from(token, "base64").toString());
// }
