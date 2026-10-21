import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent/loop";
import { checkRateLimit, getClientIp } from "@/lib/limits";
import { recommendRequestSchema, validationDetails } from "@/lib/schemas";
import { errorResponse } from "@/lib/http";
import { formatHeartbeat, formatSse, SSE_HEADERS } from "@/lib/sse";
import type { StreamEvent } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("validation_error", "Request body must be valid JSON.", 400);
  }

  const parsed = recommendRequestSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      "validation_error",
      "Request validation failed.",
      400,
      validationDetails(parsed.error),
    );
  }

  const ip = getClientIp(request);
  try {
    const perMinute = await checkRateLimit({
      rawKey: ip,
      bucket: "recommend:minute",
      limit: 6,
      windowSeconds: 60,
    });
    if (!perMinute.ok) {
      return errorResponse(
        "rate_limited",
        "Too many shortlist requests. Please wait a moment.",
        429,
        undefined,
        { "Retry-After": String(Math.max(1, Math.ceil((perMinute.resetAt - Date.now()) / 1000))) },
      );
    }

    const perHour = await checkRateLimit({
      rawKey: ip,
      bucket: "recommend:hour",
      limit: 30,
      windowSeconds: 3_600,
    });
    if (!perHour.ok) {
      return errorResponse(
        "rate_limited",
        "Hourly limit reached. Please try again later.",
        429,
        undefined,
        { "Retry-After": String(Math.max(1, Math.ceil((perHour.resetAt - Date.now()) / 1000))) },
      );
    }
  } catch {
    return errorResponse(
      "upstream_unavailable",
      "The shortlist service is temporarily unavailable.",
      503,
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: StreamEvent) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(formatSse(event.event, event.data)));
        } catch {
          closed = true;
        }
      };

      const heartbeat = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(formatHeartbeat()));
        } catch {
          closed = true;
        }
      }, 10_000);

      const onAbort = () => {
        closed = true;
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // already closed
        }
      };
      request.signal.addEventListener("abort", onAbort, { once: true });

      try {
        await runAgent(parsed.data, send, { signal: request.signal });
      } catch {
        if (!request.signal.aborted) {
          send({
            event: "error",
            data: {
              code: "internal_error",
              message: "The shortlist could not be completed. Please try again.",
            },
          });
        }
      } finally {
        clearInterval(heartbeat);
        request.signal.removeEventListener("abort", onAbort);
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // already closed
          }
        }
      }
    },
  });

  return new Response(stream, { headers: SSE_HEADERS });
}
