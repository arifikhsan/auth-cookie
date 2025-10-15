// lib/auth.ts

const ACCESS_TOKEN_LIFETIME = 10 * 1000; // 10s for demo
const REFRESH_TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour

export function createToken(email: string, type: "access" | "refresh") {
  const exp =
    Date.now() +
    (type === "access" ? ACCESS_TOKEN_LIFETIME : REFRESH_TOKEN_LIFETIME);
  return Buffer.from(JSON.stringify({ email, exp, type })).toString("base64");
}

export function verifyToken(
  token?: string,
  expectedType?: "access" | "refresh"
) {
  if (!token) return null;
  try {
    const data = JSON.parse(Buffer.from(token, "base64").toString());
    if (expectedType && data.type !== expectedType) return null;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function decodeJwt(token: string): any {
  //   return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  return JSON.parse(Buffer.from(token, "base64").toString());
}
