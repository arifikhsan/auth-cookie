'use client';

import { useAutoRefreshToken } from "@/lib/auto-refresh";


/**
 * This component runs globally inside layout
 * but keeps layout SSR.
 */
export default function AutoRefreshClient() {
  useAutoRefreshToken(5000); // check every 5 seconds
  return null; // doesn’t render anything visible
}
