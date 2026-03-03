import { randomBytes, createHash } from 'crypto';

/**
 * Generate a 32-byte hex removal token.
 * Returns both the raw token (shown to user once) and its SHA-256 hash (stored in DB).
 */
export function generateRemovalToken(): { raw: string; hash: string } {
  const raw = randomBytes(32).toString('hex'); // 64-char hex string
  const hash = hashToken(raw);
  return { raw, hash };
}

/** Hash a token for safe DB storage (SHA-256). */
export function hashToken(raw: string): string {
  return createHash('sha256').update(raw).digest('hex');
}
