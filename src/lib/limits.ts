import { createHash } from "node:crypto";
import { env, isUpstashEnabled } from "@/lib/env";

interface CounterResult {
  count: number;
  resetAt: number;
}

interface CounterStore {
  incr(key: string, ttlSeconds: number): Promise<CounterResult>;
  get(key: string): Promise<number>;
  incrBy(key: string, amount: number, ttlSeconds: number): Promise<number>;
}

interface MemoryEntry {
  count: number;
  resetAt: number;
}

const memory = new Map<string, MemoryEntry>();

function nowMs() {
  return Date.now();
}

function sweepMemory() {
  const now = nowMs();
  for (const [key, entry] of memory) {
    if (entry.resetAt <= now) memory.delete(key);
  }
}

const memoryStore: CounterStore = {
  async incr(key, ttlSeconds) {
    sweepMemory();
    const now = nowMs();
    const existing = memory.get(key);
    if (!existing || existing.resetAt <= now) {
      const resetAt = now + ttlSeconds * 1000;
      memory.set(key, { count: 1, resetAt });
      return { count: 1, resetAt };
    }
    existing.count += 1;
    return { count: existing.count, resetAt: existing.resetAt };
  },
  async get(key) {
    sweepMemory();
    return memory.get(key)?.count ?? 0;
  },
  async incrBy(key, amount, ttlSeconds) {
    sweepMemory();
    const now = nowMs();
    const existing = memory.get(key);
    if (!existing || existing.resetAt <= now) {
      const resetAt = now + ttlSeconds * 1000;
      memory.set(key, { count: amount, resetAt });
      return amount;
    }
    existing.count += amount;
    return existing.count;
  },
};

async function upstashPipeline(commands: Array<Array<string | number>>): Promise<unknown[]> {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Upstash is not configured");
  }
  const response = await fetch(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(2_000),
  });
  if (!response.ok) {
    throw new Error(`Upstash request failed with ${response.status}`);
  }
  const payload = (await response.json()) as Array<{ result?: unknown; error?: string }>;
  const failed = payload.find((item) => item.error);
  if (failed) throw new Error(failed.error);
  return payload.map((item) => item.result);
}

const redisStore: CounterStore = {
  async incr(key, ttlSeconds) {
    const results = await upstashPipeline([
      ["INCR", key],
      ["EXPIRE", key, ttlSeconds, "NX"],
    ]);
    const count = Number(results[0] ?? 0);
    return { count, resetAt: nowMs() + ttlSeconds * 1000 };
  },
  async get(key) {
    const results = await upstashPipeline([["GET", key]]);
    const value = results[0];
    return typeof value === "string" ? Number(value) : Number(value ?? 0);
  },
  async incrBy(key, amount, ttlSeconds) {
    const results = await upstashPipeline([
      ["INCRBY", key, amount],
      ["EXPIRE", key, ttlSeconds, "NX"],
    ]);
    return Number(results[0] ?? 0);
  },
};

function store(): CounterStore {
  return isUpstashEnabled ? redisStore : memoryStore;
}

export function limiterMode(): "redis" | "memory" {
  return isUpstashEnabled ? "redis" : "memory";
}

export async function hashKey(value: string): Promise<string> {
  return createHash("sha256").update(value).digest("hex").slice(0, 32);
}

export async function checkRateLimit(options: {
  rawKey: string;
  bucket: string;
  limit: number;
  windowSeconds: number;
}): Promise<{ ok: boolean; remaining: number; resetAt: number }> {
  const key = `tm:rl:${options.bucket}:${await hashKey(options.rawKey)}`;
  const result = await store().incr(key, options.windowSeconds);
  return {
    ok: result.count <= options.limit,
    remaining: Math.max(0, options.limit - result.count),
    resetAt: result.resetAt,
  };
}

function utcDay(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getDailyTokenUsage(): Promise<number> {
  return store().get(`tm:llm:tokens:${utcDay()}`);
}

export async function canSpendTokens(estimatedTokens: number): Promise<boolean> {
  const usage = await getDailyTokenUsage();
  return usage + estimatedTokens <= env.DAILY_LLM_BUDGET;
}

export async function recordTokenUsage(tokens: number): Promise<number> {
  if (tokens <= 0) return getDailyTokenUsage();
  return store().incrBy(`tm:llm:tokens:${utcDay()}`, tokens, 60 * 60 * 48);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "local";
}

/** Test-only helper. */
export function resetMemoryCounters() {
  memory.clear();
}
