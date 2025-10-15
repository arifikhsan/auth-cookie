// lib/auth.ts

import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_SECRET = 'access_secret_key';
const REFRESH_TOKEN_SECRET = 'refresh_secret_key';

export function createToken(email: string, type: 'access' | 'refresh') {
  const payload = { email };

  const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
  const expiresIn = type === 'access' ? '2m' : '7d'; // short-lived access, longer refresh

  return jwt.sign(payload, secret, { expiresIn });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJwt(token: string): any {
  return jwtDecode(token)
}
