'use client';

import { useEffect, useState } from 'react';
import axiosClient from '@/lib/axios-client'; // your configured axios instance

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthPayload {
  email: string;
}

export function useAuth() {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [payload, setPayload] = useState<AuthPayload | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await axiosClient.get('/api/me', { withCredentials: true });
        if (res.data?.success && res.data.user) {
          if (mounted) {
            setPayload(res.data.user);
            setStatus('authenticated');
          }
        } else {
          if (mounted) {
            setPayload(null);
            setStatus('unauthenticated');
          }
        }
      } catch (err) {
        console.log(err)
        if (mounted) {
          setPayload(null);
          setStatus('unauthenticated');
        }
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return { status, payload };
}
