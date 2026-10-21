import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/env";
import { checkRateLimit, getClientIp } from "@/lib/limits";
import { searchQuerySchema, validationDetails } from "@/lib/schemas";
import { errorResponse } from "@/lib/http";
import { mockSearch } from "@/data/mock-catalog";
import {
  QlooError,
  mapSearchResponse,
  mapTagResponse,
  searchEntities,
  searchTags,
} from "@/lib/qloo/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
    type: url.searchParams.get("type") ?? undefined,
  });

  if (!parsed.success) {
    return errorResponse(
      "validation_error",
      "Search parameters are invalid.",
      400,
      validationDetails(parsed.error),
    );
  }

  let rate;
  try {
    rate = await checkRateLimit({
      rawKey: getClientIp(request),
      bucket: "search",
      limit: 60,
      windowSeconds: 60,
    });
  } catch {
    return errorResponse("upstream_unavailable", "Search is temporarily unavailable.", 503);
  }

  if (!rate.ok) {
    return errorResponse(
      "rate_limited",
      "Too many searches. Please wait a moment and try again.",
      429,
      undefined,
      { "Retry-After": String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))) },
    );
  }

  if (isMockMode) {
    return NextResponse.json({ results: mockSearch(parsed.data.q, parsed.data.type) });
  }

  try {
    if (parsed.data.type === "cuisine") {
      const payload = await searchTags(parsed.data.q);
      return NextResponse.json({ results: mapTagResponse(payload) });
    }
    const payload = await searchEntities(parsed.data.q, parsed.data.type);
    return NextResponse.json({ results: mapSearchResponse(payload, parsed.data.type) });
  } catch (error) {
    if (error instanceof QlooError && error.code === "rate_limited") {
      return errorResponse("rate_limited", "Qloo is rate limiting requests. Try again shortly.", 429);
    }
    return errorResponse(
      "upstream_unavailable",
      "Search is temporarily unavailable. You can still use a sample persona.",
      502,
    );
  }
}
