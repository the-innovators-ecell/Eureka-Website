/**
 * In-memory rate limiter for brute-force protection.
 * Tracks attempts per key (e.g., IP address) within a time window.
 *
 * Note: Resets on server restart. Sufficient for college event scale.
 * For production at massive scale, use Redis-backed rate limiting.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Check if a key has exceeded the rate limit.
 *
 * @param key       - Unique identifier (e.g., IP address)
 * @param maxAttempts - Maximum attempts allowed (default: 5)
 * @param windowMs   - Time window in milliseconds (default: 15 minutes)
 * @returns Object with `allowed` boolean and `remainingAttempts`
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remainingAttempts: number; retryAfterMs: number } {
  const now = Date.now();
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

/**
 * Get the client IP from the request headers.
 */
export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
