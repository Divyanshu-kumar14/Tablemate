"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Info, RefreshCw, Sparkles, SlidersHorizontal } from "lucide-react";
import type { RecommendRequest } from "@/lib/schemas";
import type { WireCard } from "@/types/domain";
import type { AgentDone, AgentStep } from "@/types/agent-ui";
import { getPersona } from "@/data/personas";
import { loadDraft } from "@/lib/client/draft";
import { EVIDENCE_COPY, needsSummary } from "@/lib/labels";
import { parseSseEvents, type ParsedSseEvent } from "@/lib/sse-client";
import { AgentSteps } from "@/components/agent-steps";
import { RestaurantCard } from "@/components/restaurant-card";
import { Disclaimer } from "@/components/disclaimer";

function CardSkeletons() {
  return (
    <div className="space-y-6" aria-hidden="true">
      {[0, 1].map((index) => (
        <div key={index} className="liquid-glass p-6 sm:p-8 animate-pulse space-y-4">
          <div className="h-4 w-28 rounded bg-white/[0.08]" />
          <div className="h-8 w-2/3 rounded bg-white/[0.08]" />
          <div className="h-4 w-40 rounded bg-white/[0.06]" />
          <div className="h-16 w-full rounded-xl bg-white/[0.04]" />
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="h-7 w-32 rounded-full bg-white/[0.06]" />
            <div className="h-7 w-28 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
  loading,
}: {
  message: string;
  onRetry: () => void;
  loading: boolean;
}) {
  return (
    <div role="alert" className="liquid-glass border-amber-500/30 bg-amber-950/40 p-5 text-amber-200">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-amber-300">Shortlist Stream Interrupted</p>
          <p className="mt-1 text-xs leading-relaxed text-zinc-300">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="btn-secondary mt-3 !min-h-[40px] !px-3.5 !text-xs font-semibold"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            Retry Stream
          </button>
        </div>
      </div>
    </div>
  );
}

function TrustPanel() {
  return (
    <div className="liquid-glass liquid-glass-specular mt-4 p-5 text-xs">
      <h2 className="eyebrow">Evidence Label Guide</h2>
      <ul className="mt-3 space-y-3">
        {(["reported", "likely", "ask"] as const).map((label) => (
          <li key={label} className="flex gap-2.5">
            <span
              className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                label === "reported"
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                  : label === "likely"
                    ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                    : "bg-slate-400"
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-zinc-200">
                {EVIDENCE_COPY[label].label}{" "}
                <span className="font-normal text-zinc-500">· {EVIDENCE_COPY[label].short}</span>
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-400 leading-relaxed">
                {EVIDENCE_COPY[label].description}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3.5 border-t border-white/[0.08] pt-3 text-[11px] text-zinc-500">
        Labels describe observable evidence, not safety guarantees. Confirm critical requirements by phone.
      </p>
    </div>
  );
}

function NoRequest() {
  return (
    <section className="container-page py-16 sm:py-24 text-center">
      <div className="liquid-glass liquid-glass-specular mx-auto max-w-xl p-8 sm:p-12">
        <p className="eyebrow">Empty Profile</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-zinc-100">
          Build a shortlist to get started.
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Select a sample persona for an instant live demo, or input custom taste seeds and dietary constraints.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/results?persona=p1" className="btn-primary !text-sm">
            Launch Sylvia&apos;s Shortlist
          </Link>
          <Link href="/plan" className="btn-secondary !text-sm">
            Build Custom
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyResult({ editHref }: { editHref: string }) {
  return (
    <div className="liquid-glass p-6 sm:p-8 text-center">
      <p className="eyebrow">Zero Matches Found</p>
      <h2 className="mt-2 font-display text-2xl font-bold text-zinc-100">
        No venues satisfied every selected constraint.
      </h2>
      <p className="mt-2 text-sm text-zinc-400 max-w-md mx-auto">
        A strict mobility or acoustic requirement may have excluded candidates in this radius. Try softening one constraint.
      </p>
      <Link href={editHref} className="btn-secondary mt-5 !text-sm">
        Adjust Constraints
      </Link>
    </div>
  );
}

function ResultsLoading() {
  return (
    <section className="container-page py-12">
      <div className="h-5 w-28 rounded bg-white/[0.08] animate-pulse" />
      <div className="mt-4 h-10 w-2/3 rounded bg-white/[0.08] animate-pulse" />
      <div className="mt-3 h-4 w-1/2 rounded bg-white/[0.05] animate-pulse" />
      <div className="mt-8">
        <CardSkeletons />
      </div>
    </section>
  );
}

export function ResultsClient() {
  const searchParams = useSearchParams();
  const personaParam = searchParams.get("persona");

  const [request, setRequest] = useState<RecommendRequest | null>(null);
  const [personaId, setPersonaId] = useState<string | null>(null);
  const [title, setTitle] = useState("Your Shortlist");
  const [noRequest, setNoRequest] = useState(false);
  const [cards, setCards] = useState<Map<string, WireCard>>(() => new Map());
  const [finalIds, setFinalIds] = useState<string[]>([]);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [done, setDone] = useState<AgentDone | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const persona = getPersona(personaParam);
    if (persona) {
      setRequest({
        location: persona.location,
        taste: persona.taste.map((seed) => ({ ...seed })),
        needs: {
          ...persona.needs,
          diet: [...persona.needs.diet],
          mobility: [...persona.needs.mobility],
        },
        limit: 5,
      });
      setPersonaId(persona.id);
      setTitle(`Curated Shortlist for ${persona.name}`);
      setNoRequest(false);
      return;
    }

    const draft = loadDraft();
    if (draft) {
      setRequest(draft);
      setPersonaId(null);
      setTitle("Your Custom Shortlist");
      setNoRequest(false);
      return;
    }

    setRequest(null);
    setPersonaId(null);
    setNoRequest(true);
  }, [personaParam]);

  useEffect(() => {
    if (!request) return;
    const controller = new AbortController();
    let sawDone = false;

    function handleEvent(event: ParsedSseEvent) {
      if (event.event === "step") {
        const data = JSON.parse(event.data) as AgentStep;
        setSteps((previous) => {
          const index = previous.findIndex((item) => item.step === data.step);
          if (index === -1) return [...previous, data];
          const next = [...previous];
          next[index] = data;
          return next;
        });
        return;
      }

      if (event.event === "card") {
        const card = JSON.parse(event.data) as WireCard;
        setCards((previous) => {
          const next = new Map(previous);
          const existing = next.get(card.id);
          if (!existing || card.revision >= existing.revision) next.set(card.id, card);
          return next;
        });
        if (card.revision === 1) {
          setFinalIds((previous) =>
            previous.includes(card.id) ? previous : [...previous, card.id],
          );
        }
        return;
      }

      if (event.event === "done") {
        sawDone = true;
        setDone(JSON.parse(event.data) as AgentDone);
        return;
      }

      if (event.event === "error") {
        const data = JSON.parse(event.data) as { message?: string };
        throw new Error(data.message ?? "The shortlist could not be completed.");
      }
    }

    async function run() {
      setLoading(true);
      setError(null);
      setDone(null);
      setSteps([]);
      setCards(new Map());
      setFinalIds([]);

      try {
        const response = await fetch(`/api/v1/recommend?attempt=${runId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as
            | { error?: { message?: string } }
            | null;
          throw new Error(payload?.error?.message ?? "The shortlist could not be started.");
        }
        if (!response.body) {
          throw new Error("This browser could not read the live response.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done: streamDone, value } = await reader.read();
          if (streamDone) break;
          buffer += decoder.decode(value, { stream: true });
          const parsed = parseSseEvents(buffer);
          buffer = parsed.rest;
          for (const event of parsed.events) handleEvent(event);
        }

        buffer += decoder.decode();
        if (buffer.trim()) {
          const parsed = parseSseEvents(`${buffer}\n\n`);
          for (const event of parsed.events) handleEvent(event);
        }

        if (!sawDone && !controller.signal.aborted) {
          throw new Error(
            "The response ended before the shortlist was complete. Please try again.",
          );
        }
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(
          caught instanceof Error ? caught.message : "Something went wrong. Please try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void run();
    return () => controller.abort();
  }, [request, runId]);

  if (noRequest) return <NoRequest />;
  if (!request) return <ResultsLoading />;

  const summary = needsSummary(request.needs);
  const tasteNames = request.taste.map((seed) => seed.name).join(" · ");
  const editHref = personaId ? `/plan?persona=${personaId}` : "/plan";
  const allCards = Array.from(cards.values());
  const orderedCards = finalIds.length
    ? [
        ...finalIds
          .map((id) => cards.get(id))
          .filter((card): card is WireCard => Boolean(card)),
        ...allCards.filter((card) => !finalIds.includes(card.id)),
      ]
    : allCards;

  const mockMode = done?.mode === "mock";
  const liveQlooFailed = done?.mode === "live" && done.degraded.includes("qloo");
  const sampleLocation = done?.degraded.includes("sample_location");
  const fewResults = done?.degraded.includes("few_results");

  return (
    <>
      {/* Top Banner Header */}
      <section className="border-b border-white/[0.08] bg-obsidian-900/60 backdrop-blur-md">
        <div className="container-page py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-zinc-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Home
          </Link>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Real-Time Recommendations</p>
              <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
                {title}
              </h1>
              <p className="mt-3 text-sm text-zinc-300 font-medium">
                {request.location}
                {summary.length > 0 ? ` · ${summary.join(" · ")}` : " · No extra constraints"}
              </p>
              <p className="mt-1 font-mono text-xs text-amber-400/90">
                Taste Seeds: {tasteNames}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link href={editHref} className="btn-secondary !min-h-[42px] !px-4 !text-xs font-semibold">
                <SlidersHorizontal className="h-3.5 w-3.5 text-amber-400" />
                Edit Profile
              </Link>
              <button
                type="button"
                onClick={() => setRunId((value) => value + 1)}
                disabled={loading}
                className="btn-secondary !min-h-[42px] !px-4 !text-xs font-semibold"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Re-stream
              </button>
            </div>
          </div>

          <div className="mt-5">
            <Disclaimer compact />
          </div>

          {mockMode && (
            <div className="liquid-glass mt-3 flex items-center gap-2.5 border-amber-500/20 bg-amber-500/05 p-3 text-xs text-amber-300">
              <Info className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <p>Sample fixtures active. Complete agent loop executes deterministically.</p>
            </div>
          )}
          {liveQlooFailed && (
            <div className="liquid-glass mt-3 flex items-center gap-2.5 border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <p>Live Qloo API timed out. Fallback fixtures surfaced with transparent labeling.</p>
            </div>
          )}
          {sampleLocation && (
            <div className="liquid-glass mt-3 flex items-center gap-2.5 border-amber-500/20 bg-amber-500/05 p-3 text-xs text-zinc-400">
              <Info className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <p>Demo fixtures cover Brooklyn, Edison, and Chicago.</p>
            </div>
          )}
          {fewResults && (
            <div className="liquid-glass mt-3 flex items-center gap-2.5 border-amber-500/20 bg-amber-500/05 p-3 text-xs text-zinc-400">
              <Info className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
              <p>Strict dining constraints filtered available candidates to verified matches only.</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Stream Area */}
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Right Aside HUD */}
        <aside className="lg:col-start-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <AgentSteps steps={steps} done={done} loading={loading} />
            <TrustPanel />
          </div>
        </aside>

        {/* Left Results Column */}
        <div className="space-y-6 lg:col-start-1 lg:row-start-1" aria-busy={loading}>
          {error && (
            <ErrorBanner
              message={error}
              onRetry={() => setRunId((value) => value + 1)}
              loading={loading}
            />
          )}

          {orderedCards.map((card, index) => (
            <RestaurantCard key={card.id} card={card} rank={index + 1} />
          ))}

          {loading && orderedCards.length === 0 && <CardSkeletons />}

          {!loading && !error && done && done.count === 0 && (
            <EmptyResult editHref={editHref} />
          )}
        </div>
      </div>
    </>
  );
}
