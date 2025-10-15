import axiosServer from '@/lib/axios-server'; // your configured SSR axios instance

type AuthStatus = 'authenticated' | 'unauthenticated';

interface AuthPayload {
  email: string;
}

export async function getAuth(cookieHeader?: string) {
  try {
    const res = await axiosServer.get('http://localhost:3000/api/me', {
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
