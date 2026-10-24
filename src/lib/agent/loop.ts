import { randomUUID } from "node:crypto";
import type { RecommendRequest } from "@/lib/schemas";
import type { StreamEvent } from "@/types/domain";
import { env, isLlmEnabled, isMockMode } from "@/lib/env";
import { canSpendTokens, recordTokenUsage } from "@/lib/limits";
import { applySeniorFit, type RankedCandidate } from "@/lib/fit/apply-senior-fit";
import { resolveSeeds, getPlaceCandidates } from "@/lib/agent/tools";
import { explainWithLlm, explainWithLlmDetailed } from "@/lib/agent/llm";
import { toCard, toWireCard, templateTasteReason } from "@/lib/cards";
import { fallbackPlacesForLocation, withMockSignals } from "@/data/mock-places";

type Emit = (event: StreamEvent) => void;

async function step<T>(
  emit: Emit,
  name: string,
  runningDetail: string,
  fn: () => Promise<T>,
  doneDetail: (result: T) => string,
): Promise<T> {
  const started = Date.now();
  emit({ event: "step", data: { step: name, status: "running", detail: runningDetail } });
  try {
    const result = await fn();
    emit({
      event: "step",
      data: { step: name, status: "done", detail: doneDetail(result), ms: Date.now() - started },
    });
    return result;
  } catch (error) {
    emit({
      event: "step",
      data: {
        step: name,
        status: "error",
        detail: "Falling back",
        ms: Date.now() - started,
      },
    });
    throw error;
  }
}

function orderWithLlm(ranked: RankedCandidate[], picks: Array<{ id: string }>): RankedCandidate[] {
  const byId = new Map(ranked.map((entry) => [entry.candidate.id, entry]));
  const ordered = picks
    .map((pick) => byId.get(pick.id))
    .filter((entry): entry is RankedCandidate => Boolean(entry));

  if (ordered.length !== ranked.length) return ranked;
  if (new Set(picks.map((pick) => pick.id)).size !== ranked.length) return ranked;

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index - 1]!.score - ordered[index]!.score > 0.1) return ranked;
  }
  return ordered;
}

export async function runAgent(
  input: RecommendRequest,
  emit: Emit,
  options: { signal?: AbortSignal } = {},
): Promise<void> {
  const started = Date.now();
  const requestId = randomUUID();
  const degraded = new Set<string>();
  let qlooCalls = 0;
  let llmUsed = false;

  const aborted = () => options.signal?.aborted === true;

  const resolved = await step(
    emit,
    "resolve_seeds",
    isMockMode ? "Preparing sample taste signals" : "Resolving taste seeds with Qloo",
    () => resolveSeeds(input.taste),
    (result) =>
      isMockMode
        ? "Fixture adapter — add a Qloo key for live resolution"
        : `${result.entities.length} resolved · ${result.tagIds.length} tags · ${result.unresolved.length} unresolved`,
  );
  qlooCalls += resolved.calls;
  if (resolved.unresolved.length > 0) degraded.add("unresolved_seeds");
  if (aborted()) return;

  let candidatesResult = await step(
    emit,
    "get_place_candidates",
    isMockMode ? `Loading sample venues for ${input.location}` : `Searching ${input.location} with Qloo`,
    () =>
      getPlaceCandidates({
        seeds: resolved.entities,
        tagIds: resolved.tagIds,
        location: input.location,
        limit: input.limit,
      }),
    (result) =>
      isMockMode
        ? `${result.candidates.length} sample venues`
        : `${result.candidates.length} candidates from Qloo`,
  );
  qlooCalls += candidatesResult.calls;
  for (const item of candidatesResult.degraded) degraded.add(item);

  if (candidatesResult.candidates.length < 3 && !isMockMode) {
    const retry = await getPlaceCandidates({
      seeds: resolved.entities,
      tagIds: resolved.tagIds,
      location: input.location,
      limit: input.limit * 2,
    });
    qlooCalls += retry.calls;
    const seen = new Set(candidatesResult.candidates.map((candidate) => candidate.id));
    candidatesResult = {
      candidates: [
        ...candidatesResult.candidates,
        ...retry.candidates.filter((candidate) => !seen.has(candidate.id)),
      ],
      calls: candidatesResult.calls + retry.calls,
      degraded: [...new Set([...candidatesResult.degraded, ...retry.degraded])],
    };
  }

  if (candidatesResult.candidates.length === 0) {
    const fallback = withMockSignals(fallbackPlacesForLocation(input.location), resolved.entities);
    candidatesResult = {
      ...candidatesResult,
      candidates: fallback,
    };
    degraded.add(isMockMode ? "sample_location" : "qloo");
  } else if (candidatesResult.candidates.length < 3) {
    degraded.add("few_results");
  }
  if (aborted()) return;

  let ranked = await step(
    emit,
    "apply_senior_fit",
    "Applying evidence labels to each candidate",
    async () => applySeniorFit(candidatesResult.candidates, input.needs, input.limit),
    (result) => `${result.length} ranked · ${result.reduce((sum, entry) => sum + entry.fit.length, 0)} labels`,
  );
  if (ranked.length === 0) {
    const fallback = withMockSignals(fallbackPlacesForLocation(input.location), resolved.entities);
    ranked = applySeniorFit(fallback, input.needs, input.limit);
    degraded.add(isMockMode ? "sample_location" : "qloo");
  }
  if (aborted()) return;

  // Preview: the first two cards are emitted before the LLM call so the
  // caregiver sees something useful within the latency budget.
  for (const entry of ranked.slice(0, 2)) {
    emit({
      event: "card",
      data: toWireCard(
        toCard({
          ranked: entry,
          seeds: resolved.entities,
          location: input.location,
          needs: input.needs,
          revision: 0,
        }),
      ),
    });
  }

  let picks: Array<{ id: string; tasteReason: string }> | null = null;
  if (ranked.length > 0) {
    const budgetOk = await canSpendTokens(env.GEMINI_MAX_TOKENS).catch(() => true);
    if (!isLlmEnabled) {
      emit({
        event: "step",
        data: {
          step: "explain",
          status: "done",
          detail: "Templated explanations — add a Gemini key for natural language",
          ms: 0,
        },
      });
    } else if (!budgetOk) {
      degraded.add("budget");
      emit({
        event: "step",
        data: {
          step: "explain",
          status: "done",
          detail: "Daily explanation budget reached — using templates",
          ms: 0,
        },
      });
    } else {
      const detailed = await step(
        emit,
        "explain",
        "Writing plain-language taste reasons",
        () =>
          explainWithLlmDetailed({
            seeds: resolved.entities,
            candidates: ranked,
            location: input.location,
            note: input.needs.note,
            signal: options.signal,
          }),
        (result) => (result.result ? `Explained ${result.result.picks.length} picks` : `Template fallback (${result.reason})`),
      );
      if (detailed.result) {
        picks = detailed.result.picks;
        llmUsed = true;
        await recordTokenUsage(detailed.result.tokens).catch(() => undefined);
      } else {
        degraded.add(`llm:${detailed.reason}`);
      }
    }
  }
  if (aborted()) return;

  const ordered = picks ? orderWithLlm(ranked, picks) : ranked;
  const reasons = new Map(picks?.map((pick) => [pick.id, pick.tasteReason]) ?? []);

  for (const entry of ordered) {
    emit({
      event: "card",
      data: toWireCard(
        toCard({
          ranked: entry,
          seeds: resolved.entities,
          location: input.location,
          needs: input.needs,
          revision: 1,
          tasteReason:
            reasons.get(entry.candidate.id) ??
            templateTasteReason(entry.candidate, resolved.entities, input.location),
        }),
      ),
    });
  }

  emit({
    event: "done",
    data: {
      count: ordered.length,
      ms: Date.now() - started,
      degraded: [...degraded],
      request_id: requestId,
      mode: isMockMode ? "mock" : "live",
      qloo_calls: qlooCalls,
      llm_used: llmUsed,
    },
  });
}
