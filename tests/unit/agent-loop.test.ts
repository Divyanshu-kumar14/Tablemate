import { describe, expect, it } from "vitest";
import type { StreamEvent, WireCard } from "@/types/domain";
import type { RecommendRequest } from "@/lib/schemas";
import type { Persona } from "@/data/personas";
import { getPersona } from "@/data/personas";
import { runAgent } from "@/lib/agent/loop";
import { hasForbiddenClaim } from "@/lib/sanitize";

type CardEvent = Extract<StreamEvent, { event: "card" }>;
type StepEvent = Extract<StreamEvent, { event: "step" }>;
type DoneEvent = Extract<StreamEvent, { event: "done" }>;

function byEvent<T extends StreamEvent["event"]>(
  events: StreamEvent[],
  name: T,
): Array<Extract<StreamEvent, { event: T }>> {
  return events.filter(
    (event): event is Extract<StreamEvent, { event: T }> => event.event === name,
  );
}

function requestFor(
  persona: Persona,
  overrides: Partial<RecommendRequest> = {},
): RecommendRequest {
  return {
    location: persona.location,
    taste: persona.taste.map((seed) => ({ ...seed })),
    needs: {
      ...persona.needs,
      diet: [...persona.needs.diet],
      mobility: [...persona.needs.mobility],
    },
    limit: 5,
    ...overrides,
  };
}

async function collect(request: RecommendRequest): Promise<StreamEvent[]> {
  const events: StreamEvent[] = [];
  await runAgent(request, (event) => events.push(event));
  return events;
}

function expectHonestCard(card: WireCard) {
  expect(card.score).toBeGreaterThanOrEqual(0);
  expect(card.score).toBeLessThanOrEqual(1);
  expect(card.qloo_entity_id).toBe(card.id);
  expect(card.before_you_go.length).toBeGreaterThanOrEqual(3);
  expect(card.before_you_go.length).toBeLessThanOrEqual(4);
  expect(card.before_you_go.every((question) => question.endsWith("?"))).toBe(true);

  for (const item of card.fit) {
    expect(["reported", "likely", "ask"]).toContain(item.label);
    expect(item.need.length).toBeGreaterThan(0);
    expect(item.why.length).toBeGreaterThan(10);
    expect(hasForbiddenClaim(item.why)).toBe(false);
  }
  expect(hasForbiddenClaim(card.taste_reason)).toBe(false);
}

describe("runAgent in mock mode", () => {
  it("emits the full P1 flow with previews, final cards, and done", async () => {
    const sylvia = getPersona("p1")!;
    const events = await collect(requestFor(sylvia));

    const steps = byEvent(events, "step").map((event) => event.data);
    const stepNames = [...new Set(steps.map((step) => step.step))];
    expect(stepNames).toEqual([
      "resolve_seeds",
      "get_place_candidates",
      "apply_senior_fit",
      "explain",
    ]);
    expect(steps.every((step) => step.status === "done" || step.status === "running")).toBe(true);
    expect(steps.find((step) => step.step === "explain")?.detail).toMatch(/Templated explanations/i);

    const cards = byEvent(events, "card").map((event) => event.data);
    const previews = cards.filter((card) => card.revision === 0);
    const finals = cards.filter((card) => card.revision === 1);

    expect(previews).toHaveLength(2);
    expect(finals).toHaveLength(5);
    expect(finals[0]?.id).toBe(previews[0]?.id);
    expect(finals[1]?.id).toBe(previews[1]?.id);
    for (const card of finals) expectHonestCard(card);

    const done = byEvent(events, "done");
    expect(done).toHaveLength(1);
    expect(done[0]?.data).toMatchObject({
      count: 5,
      mode: "mock",
      qloo_calls: 0,
      llm_used: false,
      degraded: [],
    });
    expect(done[0]?.data.request_id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(done[0]?.data.ms).toBeGreaterThanOrEqual(0);
  });

  it("keeps P1 texture, sodium, and diet as likely, never reported", async () => {
    const events = await collect(requestFor(getPersona("p1")!));
    const finals = byEvent(events, "card")
      .map((event) => event.data)
      .filter((card) => card.revision === 1);

    for (const card of finals) {
      const labels = Object.fromEntries(card.fit.map((item) => [item.need, item.label]));
      expect(labels["Soft texture"]).toBe("likely");
      expect(labels["Lower sodium"]).toBe("likely");
      expect(labels["Diabetic-friendly"]).not.toBe("reported");
      expect(labels["Quiet room"]).not.toBe("likely");
      expect(labels["Step-free entrance"]).not.toBe("likely");
    }
  });

  it("never infers a puréed texture for P3 and always asks the preparation question", async () => {
    const events = await collect(requestFor(getPersona("p3")!));
    const finals = byEvent(events, "card")
      .map((event) => event.data)
      .filter((card) => card.revision === 1);

    expect(finals).toHaveLength(5);
    for (const card of finals) {
      const texture = card.fit.find((item) => item.need === "Very soft / puréed texture");
      expect(texture).toMatchObject({ label: "ask" });
      expect(texture?.why).toMatch(/medical texture level/i);
      expect(card.before_you_go[0]).toMatch(/texture-modified or puréed/i);

      const mobility = card.fit.filter((item) =>
        ["Wheelchair access", "Step-free entrance"].includes(item.need),
      );
      expect(mobility.length).toBeGreaterThan(0);
      expect(mobility.every((item) => item.label !== "likely")).toBe(true);
    }
  });

  it("produces a shorter but still complete script for P2", async () => {
    const events = await collect(requestFor(getPersona("p2")!));
    const finals = byEvent(events, "card")
      .map((event) => event.data)
      .filter((card) => card.revision === 1);

    expect(finals).toHaveLength(5);
    for (const card of finals) {
      expect(card.before_you_go).toHaveLength(3);
      expect(card.before_you_go[0]).toMatch(/diabetic-friendly/i);
      expect(card.fit.every((item) => item.label !== "reported" || item.need === "Moderate noise")).toBe(
        true,
      );
    }
  });

  it("falls back to sample venues with an explicit degraded flag for unknown cities", async () => {
    const events = await collect(
      requestFor(getPersona("p1")!, { location: "Austin, TX" }),
    );
    const finals = byEvent(events, "card")
      .map((event) => event.data)
      .filter((card) => card.revision === 1);
    const done = byEvent(events, "done")[0]?.data;

    expect(finals).toHaveLength(5);
    expect(done?.degraded).toContain("sample_location");
    expect(done?.mode).toBe("mock");
    for (const card of finals) {
      expect(card.signals.some((signal) => signal.source === "fallback")).toBe(true);
      expectHonestCard(card);
    }
  });

  it("does not emit cards or done after an abort", async () => {
    const controller = new AbortController();
    controller.abort();
    const events: StreamEvent[] = [];
    await runAgent(requestFor(getPersona("p1")!), (event) => events.push(event), {
      signal: controller.signal,
    });

    expect(byEvent(events, "step").length).toBeGreaterThan(0);
    expect(byEvent(events, "card")).toHaveLength(0);
    expect(byEvent(events, "done")).toHaveLength(0);
  });

  it("emits honest scores and unique card ids", async () => {
    const events = await collect(requestFor(getPersona("p1")!));
    const finals = byEvent(events, "card")
      .map((event) => event.data)
      .filter((card) => card.revision === 1);

    expect(new Set(finals.map((card) => card.id)).size).toBe(finals.length);
    for (const card of finals) {
      expect(card.score).toBeGreaterThan(0);
      expect(card.address.length).toBeGreaterThan(0);
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.taste_reason.length).toBeGreaterThan(10);
    }
  });
});
