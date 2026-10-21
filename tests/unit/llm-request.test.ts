import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RankedCandidate } from "@/lib/fit/apply-senior-fit";
import type { PlaceCandidate } from "@/types/domain";

function ranked(id: string): RankedCandidate {
  const candidate: PlaceCandidate = {
    id,
    name: `Place ${id}`,
    cuisine: "Italian",
    address: "1 Main Street, Brooklyn, NY 11201",
    phone: null,
    priceLevel: "$$",
    imageUrl: null,
    tags: [{ id: "urn:tag:genre:place:italian", name: "Italian", type: "urn:tag:genre:place" }],
    popularity: 0.7,
    affinity: 0.8,
    explainability: null,
    signals: [],
  };
  return { candidate, fit: [], score: 0.8 };
}

const picks = [
  { id: "place-1", taste_reason: "A warm room for a Miles Davis fan." },
  { id: "place-2", taste_reason: "An Italian menu with a Casablanca mood." },
  { id: "place-3", taste_reason: "A quiet table that fits the jazz you love." },
];

describe("explainWithLlm Gemini request", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.stubEnv("GEMINI_MODEL", "gemini-2.5-flash");
    vi.stubEnv("GEMINI_MAX_TOKENS", "900");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
  });

  it("posts only taste and venue data, then returns validated picks", async () => {
    const fetchMock = vi.fn(async (_url: string, _init?: RequestInit) =>
      new Response(
        JSON.stringify({
          candidates: [
            {
              content: { parts: [{ text: JSON.stringify({ picks }) }] },
              finishReason: "STOP",
            },
          ],
          usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 20, totalTokenCount: 120 },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    vi.stubGlobal("fetch", fetchMock);

    const { explainWithLlm } = await import("@/lib/agent/llm");
    const result = await explainWithLlm({
      seeds: [
        { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" },
        { name: "Casablanca", type: "movie", qlooId: "mock:movie:casablanca" },
      ],
      candidates: [ranked("place-1"), ranked("place-2"), ranked("place-3")],
      location: "Brooklyn, NY",
      note: "Loves a quiet corner.",
    });

    expect(result?.tokens).toBe(120);
    expect(result?.picks).toEqual(
      picks.map((pick) => ({ id: pick.id, tasteReason: pick.taste_reason })),
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const call = fetchMock.mock.calls[0];
    expect(call).toBeDefined();
    const [url, init] = call!;
    expect(init).toBeDefined();
    const request = init!;
    expect(url).toBe(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    );
    expect(request.method).toBe("POST");
    expect(request.headers).toMatchObject({
      "Content-Type": "application/json",
      "x-goog-api-key": "test-key",
    });

    const body = JSON.parse(String(request.body));
    expect(body.systemInstruction.parts[0].text).toContain("taste-explanation layer");
    expect(body.generationConfig).toMatchObject({
      temperature: 0.2,
      maxOutputTokens: 900,
      responseMimeType: "application/json",
    });
    expect(body.generationConfig.responseSchema.required).toEqual(["picks"]);

    const prompt = body.contents[0].parts[0].text as string;
    expect(prompt).toContain("Miles Davis");
    expect(prompt).toContain("Loves a quiet corner.");
    expect(prompt).not.toContain("dysphagia");
    expect(prompt).not.toContain("texture");
    expect(prompt).not.toContain("sodium");
    expect(body).not.toHaveProperty("needs");
  });

  it("returns null on an upstream HTTP error and logs only the status", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("upstream detail", { status: 429 })),
    );

    const { explainWithLlm } = await import("@/lib/agent/llm");
    const result = await explainWithLlm({
      seeds: [{ name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" }],
      candidates: [ranked("place-1"), ranked("place-2"), ranked("place-3")],
      location: "Brooklyn, NY",
    });

    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith("[llm] Gemini request failed with HTTP 429");
    expect(warn.mock.calls.flat().join(" ")).not.toContain("test-key");
    expect(warn.mock.calls.flat().join(" ")).not.toContain("upstream detail");
  });

  it("returns null when Gemini blocks the response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            promptFeedback: { blockReason: "SAFETY" },
            candidates: [],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const { explainWithLlm } = await import("@/lib/agent/llm");
    const result = await explainWithLlm({
      seeds: [{ name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" }],
      candidates: [ranked("place-1"), ranked("place-2"), ranked("place-3")],
      location: "Brooklyn, NY",
    });

    expect(result).toBeNull();
  });

  it("returns null if the model invents a venue id outside the candidate set", async () => {
    const invented = [
      ...picks.slice(0, 2),
      { id: "not-a-candidate", taste_reason: "A place that was never fetched." },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({
            candidates: [
              {
                content: { parts: [{ text: JSON.stringify({ picks: invented }) }] },
                finishReason: "STOP",
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const { explainWithLlm } = await import("@/lib/agent/llm");
    const result = await explainWithLlm({
      seeds: [{ name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" }],
      candidates: [ranked("place-1"), ranked("place-2"), ranked("place-3")],
      location: "Brooklyn, NY",
    });

    expect(result).toBeNull();
  });
});
