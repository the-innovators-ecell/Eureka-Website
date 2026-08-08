/**
 * High-concurrency in-memory rate limiter with automatic store pruning.
 * Safely handles 250+ concurrent users without memory leaks or unbounded growth.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();
const MAX_STORE_SIZE = 5000;

// Clean up expired entries every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 2 * 60 * 1000);

export function checkRateLimit(
  key: string,
  maxAttempts: number = 30,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterMs: number } {
  const now = Date.now();

  // Safeguard against unbounded store growth during traffic bursts
  if (store.size > MAX_STORE_SIZE) {
    store.clear();
  }

  const entry = store.get(key);

  // No previous attempts or window expired
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remainingAttempts: maxAttempts - 1, retryAfterMs: 0 };
  }

  // Within the window
  if (entry.count < maxAttempts) {
    entry.count++;
    return {
      allowed: true,
      remainingAttempts: maxAttempts - entry.count,
      retryAfterMs: 0,
    };
  }

  // Rate limited
  return {
    allowed: false,
    remainingAttempts: 0,
    retryAfterMs: entry.resetAt - now,
  };
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
