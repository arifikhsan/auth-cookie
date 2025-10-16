'use server'

import axiosServer from '@/lib/axios-server'; // your configured SSR axios instance
import { cookies } from 'next/headers';

type AuthStatus = 'authenticated' | 'unauthenticated';

interface AuthPayload {
  email: string;
}

export async function getAuth() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; ");

  try {
    const res = await axiosServer.get(`${process.env.APP_URL}/api/me`, {
      headers: cookieHeader ? { Cookie: cookieHeader } : undefined,
      withCredentials: true,
    });

    if (res.data?.success && res.data.user) {
      return {
        status: 'authenticated' as AuthStatus,
        payload: res.data.user as AuthPayload,
      };
    }

    return {
      status: 'unauthenticated' as AuthStatus,
      payload: null,
    };
  } catch {
    return {
      status: 'unauthenticated' as AuthStatus,
      payload: null,
    };
  }
}
