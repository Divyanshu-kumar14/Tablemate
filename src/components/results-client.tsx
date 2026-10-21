"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowLeft, Info, RefreshCw } from "lucide-react";
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
        <div key={index} className="card-paper p-6 sm:p-8">
          <div className="h-4 w-24 rounded skeleton" />
          <div className="mt-3 h-10 w-2/3 rounded skeleton" />
          <div className="mt-2 h-4 w-40 rounded skeleton" />
          <div className="mt-6 h-16 w-full rounded-xl skeleton" />
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="h-8 w-36 rounded-full skeleton" />
            <div className="h-8 w-32 rounded-full skeleton" />
            <div className="h-8 w-28 rounded-full skeleton" />
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
    <div role="alert" className="rounded-xl border border-amber/40 bg-amber-light/60 p-5">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
        <div>
          <p className="text-[1.05rem] font-semibold">We hit a snag.</p>
          <p className="mt-1 text-[0.95rem] leading-relaxed text-muted">{message}</p>
          <button
            type="button"
            onClick={onRetry}
            disabled={loading}
            className="btn-secondary mt-3 !min-h-[48px] !px-4 !text-[0.95rem]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function TrustPanel() {
  const dots: Record<string, string> = {
    reported: "bg-[#16A34A]",
    likely: "bg-[#D97706]",
    ask: "bg-[#64748B]",
  };

  return (
    <div className="card-paper mt-4 p-5">
      <h2 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-teal">
        How to read a card
      </h2>
      <ul className="mt-3 space-y-3">
        {(["reported", "likely", "ask"] as const).map((label) => (
          <li key={label} className="flex gap-2.5">
            <span
              className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${dots[label]}`}
              aria-hidden="true"
            />
            <div>
              <p className="text-[0.95rem] font-semibold leading-snug">
                {EVIDENCE_COPY[label].label}{" "}
                <span className="font-normal text-muted">— {EVIDENCE_COPY[label].short}</span>
              </p>
              <p className="mt-0.5 text-[0.85rem] leading-snug text-muted">
                {EVIDENCE_COPY[label].description}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-line/70 pt-3 text-[0.9rem] leading-relaxed text-muted">
        Labels describe evidence, not the kitchen. Confirm every need by phone.
      </p>
    </div>
  );
}

function NoRequest() {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="max-w-xl">
        <p className="eyebrow">Nothing here yet</p>
        <h1 className="mt-3 font-display text-[2.7rem] font-semibold leading-tight">
          Build a shortlist first.
        </h1>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">
          Pick a persona for the one-tap demo, or start with a taste signal.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/results?persona=p1" className="btn-primary">
            Try Sylvia
          </Link>
          <Link href="/plan" className="btn-secondary">
            Build your own
          </Link>
        </div>
        <div className="mt-6">
          <Disclaimer compact />
        </div>
      </div>
    </section>
  );
}

function EmptyResult({ editHref }: { editHref: string }) {
  return (
    <div className="card-paper p-6 sm:p-8">
      <p className="eyebrow">No matches</p>
      <h2 className="mt-2 font-display text-[1.8rem] leading-tight">
        We could not find a place that clears those filters.
      </h2>
      <p className="mt-2 text-[1rem] leading-relaxed text-muted">
        A mobility requirement may have excluded every candidate in the data. Try removing one
        filter or widening the location — we would rather show you an honest empty list than a
        bad match.
      </p>
      <Link href={editHref} className="btn-secondary mt-5">
        Edit needs
      </Link>
    </div>
  );
}

function ResultsLoading() {
  return (
    <section className="container-page py-12">
      <div className="h-5 w-28 rounded skeleton" />
      <div className="mt-4 h-12 w-2/3 rounded skeleton" />
      <div className="mt-3 h-5 w-1/2 rounded skeleton" />
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
  const [title, setTitle] = useState("Your shortlist");
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
      setTitle(`A shortlist for ${persona.name}`);
      setNoRequest(false);
      return;
    }

    const draft = loadDraft();
    if (draft) {
      setRequest(draft);
      setPersonaId(null);
      setTitle("Your shortlist");
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
      <section className="border-b border-line/70 bg-paper/40">
        <div className="container-page py-9 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Home
          </Link>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Your shortlist</p>
              <h1 className="mt-2 font-display text-[2.6rem] font-semibold leading-[1.04] sm:text-[3.5rem]">
                {title}
              </h1>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">
                {request.location}
                {summary.length > 0 ? ` · ${summary.join(" · ")}` : " · no extra needs"}
              </p>
              <p className="mt-1 text-[0.95rem] text-muted">Taste: {tasteNames}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={editHref} className="btn-secondary !min-h-[48px] !px-4 !text-[0.95rem]">
                Edit needs
              </Link>
              <button
                type="button"
                onClick={() => setRunId((value) => value + 1)}
                disabled={loading}
                className="btn-secondary !min-h-[48px] !px-4 !text-[0.95rem]"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  aria-hidden="true"
                />
                Refresh
              </button>
            </div>
          </div>

          <div className="mt-5">
            <Disclaimer compact />
          </div>

          {mockMode && (
            <div className="mt-3 flex gap-3 rounded-xl border border-teal/25 bg-teal-light/40 p-4 text-[0.95rem] leading-relaxed">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
              <p>
                <strong className="font-semibold">Sample data.</strong> No Qloo key is
                configured. Every venue here is fictional, and the full agent flow still runs.
              </p>
            </div>
          )}
          {liveQlooFailed && (
            <div className="mt-3 flex gap-3 rounded-xl border border-amber/40 bg-amber-light/60 p-4 text-[0.95rem] leading-relaxed">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <p>
                Live Qloo results were unavailable. Sample venues are shown and labeled so you
                can still evaluate the flow.
              </p>
            </div>
          )}
          {sampleLocation && (
            <div className="mt-3 flex gap-3 rounded-xl border border-amber/40 bg-amber-light/60 p-4 text-[0.95rem] leading-relaxed">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <p>
                Sample data currently covers Brooklyn, Edison, and Chicago. Add a Qloo key for
                live coverage in other cities.
              </p>
            </div>
          )}
          {fewResults && (
            <div className="mt-3 flex gap-3 rounded-xl border border-amber/40 bg-amber-light/60 p-4 text-[0.95rem] leading-relaxed">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber" aria-hidden="true" />
              <p>Fewer than three live matches. We are showing what exists rather than padding.</p>
            </div>
          )}

          <p className="sr-only" aria-live="polite">
            {loading ? "Finding places." : done ? `${done.count} places found.` : ""}
          </p>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <aside className="lg:col-start-2 lg:row-start-1">
          <div className="lg:sticky lg:top-24">
            <AgentSteps steps={steps} done={done} loading={loading} />
            <TrustPanel />
          </div>
        </aside>

        <div className="space-y-6 lg:col-start-1 lg:row-start-1" aria-busy={loading}>
          {error && (
            <ErrorBanner
              message={error}
              onRetry={() => setRunId((value) => value + 1)}
              loading={loading}
            />
          )}

          {orderedCards.length > 0 && <h2 className="sr-only">Restaurant shortlist</h2>}

          {orderedCards.map((card, index) => (
            <RestaurantCard key={card.id} card={card} rank={index + 1} />
          ))}

          {loading && orderedCards.length === 0 && <CardSkeletons />}

          {!loading && !error && done && done.count === 0 && (
            <EmptyResult editHref={editHref} />
          )}

          {!loading && !error && !done && orderedCards.length === 0 && (
            <ErrorBanner
              message="The shortlist did not finish. Please try again."
              onRetry={() => setRunId((value) => value + 1)}
              loading={loading}
            />
          )}

          {orderedCards.length > 0 && (
            <p className="text-center text-[0.9rem] text-muted">
              That&apos;s the shortlist. Call ahead — the data cannot taste the soup.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
