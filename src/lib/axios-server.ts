// lib/axiosServer.ts
import axios from "axios";
import { cookies } from "next/headers";

export async function getFreshServerToken() {
  const cookieStore = await cookies(); // ✅ Await cookies()
  const serializedCookies = Array.from(cookieStore.getAll())
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const base = process.env.APP_URL || "http://localhost:3000";

  const res = await fetch(`${base}/api/get-fresh-access-token`, {
    credentials: "include",
    headers: {
      cookie: serializedCookies, // ✅ pass actual cookie string
    },
    cache: "no-store",
  });
  const data = await res.json();
  return data.accessToken || null;
}

export function createAxiosServer() {
  const instance = axios.create({
    baseURL: process.env.APP_URL || "http://localhost:3000",
    withCredentials: true,
  });

  instance.interceptors.request.use(async (config) => {
    const token = await getFreshServerToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

const axiosServer = createAxiosServer();
export default axiosServer;
