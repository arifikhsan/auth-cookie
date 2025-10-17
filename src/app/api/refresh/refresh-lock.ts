import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv(); // automatically uses UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

const LOCK_KEY = "global_refresh_lock";
const LOCK_TTL = 5; // seconds

export async function runGlobalRefreshLock<T>(task: () => Promise<T>): Promise<T> {
  const gotLock = await redis.set(LOCK_KEY, "1", { nx: true, ex: LOCK_TTL });

  if (!gotLock) {
    console.log("⏳ Waiting for global refresh...");
    // poll until lock released
    await new Promise((res) => setTimeout(res, 300));
    return runGlobalRefreshLock(task);
  }

  try {
    console.log("🚀 Acquired global refresh lock");
    return await task();
  } finally {
    await redis.del(LOCK_KEY);
    console.log("✅ Released global refresh lock");
  }
}
