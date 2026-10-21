import { describe, expect, it } from "vitest";
import type { Needs } from "@/types/domain";
import { buildBeforeYouGo } from "@/lib/fit/script";

const BASE_NEEDS: Needs = {
  texture: "regular",
  sodium: "no-preference",
  diet: [],
  mobility: [],
};

function makeNeeds(overrides: Partial<Needs> = {}): Needs {
  return { ...BASE_NEEDS, ...overrides };
}

describe("buildBeforeYouGo", () => {
  it("prioritizes a puréed question for very-soft needs", () => {
    const questions = buildBeforeYouGo(
      makeNeeds({
        texture: "very-soft",
        sodium: "lower",
        noise: "quiet",
        mobility: ["wheelchair"],
      }),
    );

    expect(questions).toHaveLength(4);
    expect(questions[0]).toMatch(/texture-modified or puréed/i);
    expect(questions[1]).toMatch(/wheelchair/i);
    expect(questions[2]).toMatch(/less salt/i);
    expect(questions[3]).toMatch(/quieter/i);
  });

  it("asks about soft texture, step-free entry, sodium, and diabetes for Sylvia", () => {
    const questions = buildBeforeYouGo(
      makeNeeds({
        texture: "soft",
        sodium: "lower",
        diet: ["diabetic-friendly"],
        noise: "quiet",
        mobility: ["step-free"],
      }),
    );

    expect(questions).toHaveLength(4);
    expect(questions[0]).toMatch(/soft enough to cut with a fork/i);
    expect(questions[1]).toMatch(/step-free/i);
    expect(questions[2]).toMatch(/less salt/i);
    expect(questions[3]).toMatch(/diabetic-friendly/i);
    expect(questions.join(" ")).not.toMatch(/quieter area/i);
  });

  it("fills to three questions when the profile has only one need", () => {
    const questions = buildBeforeYouGo(
      makeNeeds({ diet: ["diabetic-friendly"], noise: "moderate" }),
    );

    expect(questions).toHaveLength(3);
    expect(questions[0]).toMatch(/diabetic-friendly/i);
    expect(questions[1]).toMatch(/menu and how dishes are prepared/i);
    expect(questions[2]).toMatch(/anything I should know/i);
  });

  it("always returns 3–4 distinct questions", () => {
    const profiles: Needs[] = [
      makeNeeds(),
      makeNeeds({ texture: "soft" }),
      makeNeeds({ texture: "very-soft" }),
      makeNeeds({ sodium: "lower" }),
      makeNeeds({ diet: ["renal-friendly", "gluten-free"] }),
      makeNeeds({ noise: "quiet", mobility: ["hearing-friendly", "low-vision-friendly"] }),
      makeNeeds({
        texture: "soft",
        sodium: "lower",
        diet: ["diabetic-friendly", "gluten-free"],
        noise: "quiet",
        mobility: ["wheelchair", "step-free"],
      }),
    ];

    for (const needs of profiles) {
      const questions = buildBeforeYouGo(needs);
      expect(questions.length).toBeGreaterThanOrEqual(3);
      expect(questions.length).toBeLessThanOrEqual(4);
      expect(new Set(questions).size).toBe(questions.length);
      expect(questions.every((question) => question.trim().length > 10)).toBe(true);
    }
  });

  it("never asserts that a need is met", () => {
    const questions = buildBeforeYouGo(
      makeNeeds({
        texture: "very-soft",
        sodium: "lower",
        diet: ["diabetic-friendly", "renal-friendly", "gluten-free"],
        noise: "quiet",
        mobility: ["wheelchair", "step-free", "hearing-friendly", "low-vision-friendly"],
      }),
    );

    expect(questions.join(" ")).not.toMatch(/\b(safe|guaranteed|compliant|approved|verified|certified)\b/i);
    expect(questions.every((question) => question.endsWith("?"))).toBe(true);
  });
});
