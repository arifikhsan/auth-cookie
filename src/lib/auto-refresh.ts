'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Automatically checks and refreshes the access token on an interval.
 * - Skips refresh if user is logged out
 * - Stops timer when tokens are gone
 * - Redirects to /login if refresh fails
 */
export function useAutoRefreshToken(intervalMs = 5000) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAndRefreshToken() {
      if (isRefreshingRef.current) return; // avoid overlaps

      try {
        // 1️⃣ Check if access token is valid
        const res = await fetch('/api/me', { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          // ✅ Token valid, do nothing
          return;
        }

        console.log('data.message: ', data.message)
        // 2️⃣ If no user or tokens missing → stop and redirect
        if (data.message?.includes('expired') || data.message?.includes('invalid')) {
          console.warn('⚠️ Access token invalid, trying refresh...');
        } else if (data.message?.includes('No access token')) {
          console.warn('⚠️ No tokens found, stopping auto-refresh.');
          stopTimer();
          router.replace('/login');
          return;
        }

        // 3️⃣ Try refresh
        isRefreshingRef.current = true;
        const refreshRes = await fetch('/api/refresh', { method: 'POST' });
        const refreshData = await refreshRes.json();

        if (refreshData.success) {
          console.log('🔄 Access token auto-refreshed');
        } else {
          console.warn('⚠️ Refresh failed:', refreshData.message);
          stopTimer();
          router.replace('/login');
        }
      } catch (err) {
        console.debug('Token check skipped due to network error.');
      } finally {
        isRefreshingRef.current = false;
      }
    }

    function stopTimer() {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    // Run once immediately
    checkAndRefreshToken();

    // Schedule periodic checks
    timerRef.current = setInterval(checkAndRefreshToken, intervalMs);

    return () => stopTimer();
  }, [intervalMs, router]);
}
