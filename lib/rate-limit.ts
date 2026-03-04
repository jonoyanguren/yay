const inMemoryRateLimitStore = new Map<string, { count: number; resetAt: number }>();

export function consumeRateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const current = inMemoryRateLimitStore.get(key);

  if (!current || now > current.resetAt) {
    inMemoryRateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  if (current.count >= max) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  inMemoryRateLimitStore.set(key, current);
  return { allowed: true, remaining: Math.max(0, max - current.count), resetAt: current.resetAt };
}
