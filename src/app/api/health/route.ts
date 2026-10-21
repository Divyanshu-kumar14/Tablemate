import { NextResponse } from "next/server";
import { env, isLlmEnabled, isMockMode } from "@/lib/env";
import { limiterMode } from "@/lib/limits";
import { searchEntities } from "@/lib/qloo/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type QlooStatus = "ok" | "degraded" | "mock" | "unconfigured";

let probeCache: { at: number; value: QlooStatus } = { at: 0, value: "unconfigured" };

async function probeQloo(): Promise<QlooStatus> {
  if (isMockMode) return "mock";
  if (!env.QLOO_API_KEY) return "unconfigured";
  if (Date.now() - probeCache.at < 5 * 60_000) return probeCache.value;

  try {
    await searchEntities("Miles Davis", "artist");
    probeCache = { at: Date.now(), value: "ok" };
  } catch {
    probeCache = { at: Date.now(), value: "degraded" };
  }
  return probeCache.value;
}

export async function GET() {
  const qloo = await probeQloo();
  return NextResponse.json(
    {
      qloo,
      llm: isLlmEnabled ? "configured" : "template",
      limits: limiterMode(),
      checkedAt: new Date().toISOString(),
      version: "0.1.0",
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
