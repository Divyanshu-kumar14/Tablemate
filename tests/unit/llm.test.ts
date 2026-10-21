import { describe, expect, it } from "vitest";
import { parseLlmPicks, readGeminiText } from "@/lib/agent/llm";

const validText = JSON.stringify({
  picks: [
    { id: "place-1", taste_reason: "A warm room for a Miles Davis fan." },
    { id: "place-2", taste_reason: "An Italian menu with a Casablanca mood." },
    { id: "place-3", taste_reason: "A quiet table that fits the jazz you love." },
  ],
});

describe("parseLlmPicks", () => {
  it("accepts three to five picks", () => {
    const picks = parseLlmPicks(validText);
    expect(picks).toHaveLength(3);
    expect(picks?.[0]).toEqual({
      id: "place-1",
      tasteReason: "A warm room for a Miles Davis fan.",
    });
  });

  it("strips a markdown fence and surrounding prose", () => {
    const fenced = `Here is the JSON:\n\`\`\`json\n${validText}\n\`\`\``;
    expect(parseLlmPicks(fenced)).toHaveLength(3);
  });

  it("rejects fewer than three picks", () => {
    const two = JSON.stringify({ picks: JSON.parse(validText).picks.slice(0, 2) });
    expect(parseLlmPicks(two)).toBeNull();
  });

  it("rejects more than five picks", () => {
    const six = JSON.stringify({
      picks: Array.from({ length: 6 }, (_, index) => ({
        id: `place-${index}`,
        taste_reason: "A taste reason that is long enough.",
      })),
    });
    expect(parseLlmPicks(six)).toBeNull();
  });

  it("deduplicates ids and requires three unique picks", () => {
    const duplicate = JSON.stringify({
      picks: [
        { id: "place-1", taste_reason: "A taste reason for the first place." },
        { id: "place-1", taste_reason: "A different reason for the same place." },
        { id: "place-2", taste_reason: "A taste reason for the second place." },
      ],
    });
    expect(parseLlmPicks(duplicate)).toBeNull();
  });

  it("drops picks that make a forbidden verification claim", () => {
    const mixed = JSON.stringify({
      picks: [
        { id: "place-1", taste_reason: "A taste reason for the first place." },
        { id: "place-2", taste_reason: "This restaurant is safe for everyone." },
        { id: "place-3", taste_reason: "A taste reason for the third place." },
        { id: "place-4", taste_reason: "A taste reason for the fourth place." },
      ],
    });

    const picks = parseLlmPicks(mixed);
    expect(picks).toHaveLength(3);
    expect(picks?.some((pick) => pick.id === "place-2")).toBe(false);
  });

  it("rejects whitespace-only reasons instead of returning an empty card", () => {
    const blank = JSON.stringify({
      picks: [
        { id: "place-1", taste_reason: "   " },
        { id: "place-2", taste_reason: "A taste reason for the second place." },
        { id: "place-3", taste_reason: "A taste reason for the third place." },
      ],
    });
    expect(parseLlmPicks(blank)).toBeNull();
  });

  it("rejects malformed JSON and non-object payloads", () => {
    expect(parseLlmPicks("not json")).toBeNull();
    expect(parseLlmPicks("[]")).toBeNull();
    expect(parseLlmPicks("")).toBeNull();
  });
});

describe("readGeminiText", () => {
  it("joins text parts and reads total token usage", () => {
    const result = readGeminiText({
      candidates: [
        {
          content: { parts: [{ text: '{"picks":' }, { text: "[]}" }] },
          finishReason: "STOP",
        },
      ],
      usageMetadata: {
        promptTokenCount: 120,
        candidatesTokenCount: 30,
        totalTokenCount: 150,
      },
    });

    expect(result).toEqual({ text: '{"picks":[]}', tokens: 150 });
  });

  it("falls back to prompt plus candidate tokens", () => {
    const result = readGeminiText({
      candidates: [{ content: { parts: [{ text: "{}" }] }, finishReason: "STOP" }],
      usageMetadata: { promptTokenCount: 9, candidatesTokenCount: 4 },
    });
    expect(result?.tokens).toBe(13);
  });

  it("ignores thought parts", () => {
    const result = readGeminiText({
      candidates: [
        {
          content: {
            parts: [
              { text: "internal reasoning", thought: true },
              { text: "visible answer" },
            ],
          },
          finishReason: "STOP",
        },
      ],
    });
    expect(result?.text).toBe("visible answer");
  });

  it("rejects a blocked prompt", () => {
    expect(
      readGeminiText({
        promptFeedback: { blockReason: "SAFETY" },
        candidates: [{ content: { parts: [{ text: "{}" }] }, finishReason: "STOP" }],
      }),
    ).toBeNull();
  });

  it("rejects a safety or truncation finish reason", () => {
    for (const finishReason of ["SAFETY", "MAX_TOKENS", "RECITATION"]) {
      expect(
        readGeminiText({
          candidates: [{ content: { parts: [{ text: "{}" }] }, finishReason }],
        }),
      ).toBeNull();
    }
  });

  it("rejects missing candidates, empty parts, and empty text", () => {
    expect(readGeminiText({})).toBeNull();
    expect(readGeminiText({ candidates: [] })).toBeNull();
    expect(
      readGeminiText({
        candidates: [{ content: { parts: [] }, finishReason: "STOP" }],
      }),
    ).toBeNull();
    expect(
      readGeminiText({
        candidates: [{ content: { parts: [{ text: "   " }] }, finishReason: "STOP" }],
      }),
    ).toBeNull();
  });

  it("rejects non-object payloads", () => {
    expect(readGeminiText(null)).toBeNull();
    expect(readGeminiText("text")).toBeNull();
    expect(readGeminiText(42)).toBeNull();
  });
});
