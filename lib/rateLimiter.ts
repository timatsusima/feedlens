import { createHash } from 'crypto';

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5;

/**
 * Ephemeral in-memory rate limiter.
 * Stores only a SHA-256 hash of the IP — the raw IP is never retained.
 * Buckets reset after WINDOW_MS; the store is in-process memory only.
 */
export function checkRateLimit(rawIp: string): boolean {
  const salt = process.env.RATE_LIMIT_SALT ?? 'fl_rl';
  const key = createHash('sha256')
    .update(rawIp + salt)
    .digest('hex')
    .slice(0, 16);

  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || now > bucket.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (bucket.count >= MAX_REQUESTS) return false;
  bucket.count++;
  return true;
}
