'use client';

import { useEffect, useRef } from 'react';

/**
 * Automatically checks and refreshes the access token on an interval.
 * Works with APIs that always return 200 and a JSON { success, message }.
 */
export function useAutoRefreshToken(intervalMs = 5000) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    async function checkAndRefreshToken() {
      if (isRefreshingRef.current) return; // avoid overlapping refreshes

      try {
        // 1️⃣ Check current access token
        const res = await fetch('/api/me', { cache: 'no-store' });
        const data = await res.json();

        if (data.success) {
          // Token still valid → nothing to do
          return;
        }

        // 2️⃣ Access token expired → try to refresh
        isRefreshingRef.current = true;
        const refreshRes = await fetch('/api/refresh', { method: 'POST' });
        const refreshData = await refreshRes.json();

        if (refreshData.success) {
          console.log('🔄 Access token auto-refreshed');
        } else {
          console.warn('⚠️ Refresh failed:', refreshData.message);
        }

        isRefreshingRef.current = false;
      } catch {
        // swallow network errors silently
        console.debug('Token check skipped due to network error.');
      }
    }

    // Run once immediately
    checkAndRefreshToken();

    // Schedule repeated checks
    timerRef.current = setInterval(checkAndRefreshToken, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [intervalMs]);
}
