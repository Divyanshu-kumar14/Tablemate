import { describe, expect, it } from "vitest";
import type { Needs, PlaceCandidate } from "@/types/domain";
import { applySeniorFit, evaluateCandidate } from "@/lib/fit/apply-senior-fit";
import { getCuisineRule, SENIOR_FIT } from "@/lib/fit/schema";
import { hasForbiddenClaim } from "@/lib/sanitize";

const BASE_NEEDS: Needs = {
  texture: "regular",
  sodium: "no-preference",
  diet: [],
  mobility: [],
};

function makeNeeds(overrides: Partial<Needs> = {}): Needs {
  return { ...BASE_NEEDS, ...overrides };
}

function candidate(overrides: Partial<PlaceCandidate> = {}): PlaceCandidate {
  return {
    id: "test-place",
    name: "Test Kitchen",
    cuisine: "Italian",
    address: "1 Test Street, Brooklyn, NY 11201",
    phone: null,
    priceLevel: "$$",
    imageUrl: null,
    tags: [],
    popularity: 0.5,
    affinity: 0.5,
    explainability: null,
    signals: [],
    ...overrides,
  };
}

const quietTag = {
  id: "urn:tag:ambience:qloo:quiet",
  name: "Quiet",
  type: "urn:tag:ambience:qloo",
};
const livelyTag = {
  id: "urn:tag:ambience:qloo:lively",
  name: "Lively",
  type: "urn:tag:ambience:qloo",
};
const stepFreeTag = {
  id: "urn:tag:accessibility:place:step_free_entrance",
  name: "Step-free entrance",
  type: "urn:tag:accessibility:place",
};
const wheelchairTag = {
  id: "urn:tag:accessibility:place:wheelchair_accessible",
  name: "Wheelchair accessible",
  type: "urn:tag:accessibility:place",
};
const notWheelchairTag = {
  id: "urn:tag:accessibility:place:not_wheelchair_accessible",
  name: "Not wheelchair accessible",
  type: "urn:tag:accessibility:place",
};

describe("senior-fit data", () => {
  it("covers the 15 cuisines the app advertises", () => {
    const keys = Object.keys(SENIOR_FIT.cuisines);
    expect(keys.length).toBeGreaterThanOrEqual(15);
    expect(keys).toEqual(
      expect.arrayContaining([
        "italian",
        "japanese",
        "chinese",
        "indian",
        "thai",
        "vietnamese",
        "mexican",
        "greek",
        "mediterranean",
        "american",
        "french",
        "korean",
        "spanish",
        "middle_eastern",
        "seafood",
      ]),
    );
  });

  it("has a real explanation and rationale for every rule", () => {
    for (const rule of Object.values(SENIOR_FIT.cuisines)) {
      expect(rule.display.length).toBeGreaterThan(0);
      expect(rule.texture.why.length).toBeGreaterThan(20);
      expect(rule.texture.rationale.length).toBeGreaterThan(10);
      expect(rule.sodium.why.length).toBeGreaterThan(20);
      expect(rule.sodium.rationale.length).toBeGreaterThan(10);
      for (const note of Object.values(rule.diet)) {
        expect(note.why.length).toBeGreaterThan(20);
        expect(note.rationale.length).toBeGreaterThan(10);
      }
    }
  });

  it("contains no forbidden health claims in curated copy", () => {
    expect(hasForbiddenClaim(JSON.stringify(SENIOR_FIT))).toBe(false);
  });

  it("resolves cuisine names and slugs", () => {
    expect(getCuisineRule("Italian")?.display).toBe("Italian");
    expect(getCuisineRule("Middle Eastern")?.display).toBe("Middle Eastern");
    expect(getCuisineRule("middle_eastern")?.display).toBe("Middle Eastern");
    expect(getCuisineRule("Martian")).toBeNull();
  });
});

describe("evaluateCandidate", () => {
  it("labels cuisine inference likely and tag-backed facts reported", () => {
    const result = evaluateCandidate(
      candidate({ tags: [quietTag, stepFreeTag], affinity: 0.8 }),
      makeNeeds({
        texture: "soft",
        sodium: "lower",
        diet: ["diabetic-friendly"],
        noise: "quiet",
        mobility: ["step-free"],
      }),
    );

    const labels = Object.fromEntries(result.fit.map((item) => [item.need, item.label]));
    expect(labels["Soft texture"]).toBe("likely");
    expect(labels["Lower sodium"]).toBe("likely");
    expect(labels["Diabetic-friendly"]).toBe("likely");
    expect(labels["Quiet room"]).toBe("reported");
    expect(labels["Step-free entrance"]).toBe("reported");
    expect(result.excluded).toBe(false);
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("never infers a very-soft or puréed texture from cuisine", () => {
    const result = evaluateCandidate(
      candidate({ cuisine: "Italian", tags: [wheelchairTag] }),
      makeNeeds({ texture: "very-soft" }),
    );

    expect(result.fit).toHaveLength(1);
    expect(result.fit[0]).toMatchObject({
      need: "Very soft / puréed texture",
      label: "ask",
    });
    expect(result.fit[0]?.why).toMatch(/medical texture level/i);
  });

  it("falls back to ask when the cuisine has no rule", () => {
    const result = evaluateCandidate(
      candidate({ cuisine: "Martian" }),
      makeNeeds({ texture: "soft", sodium: "lower" }),
    );

    expect(result.fit).toHaveLength(2);
    expect(result.fit.every((item) => item.label === "ask")).toBe(true);
  });

  it("never claims a renal-friendly inference from cuisine", () => {
    const result = evaluateCandidate(
      candidate({ cuisine: "Italian" }),
      makeNeeds({ diet: ["renal-friendly"] }),
    );

    expect(result.fit).toHaveLength(1);
    expect(result.fit[0]).toMatchObject({ need: "Renal-friendly", label: "ask" });
  });

  it("excludes a venue whose tags say it is not wheelchair accessible", () => {
    const result = evaluateCandidate(
      candidate({ tags: [notWheelchairTag] }),
      makeNeeds({ mobility: ["wheelchair"] }),
    );

    expect(result.excluded).toBe(true);
    expect(result.fit).toHaveLength(0);
  });

  it("excludes a venue whose tags say there are stairs only", () => {
    const result = evaluateCandidate(
      candidate({
        tags: [{ id: "urn:tag:accessibility:place:stairs_only", name: "Stairs only", type: "" }],
      }),
      makeNeeds({ mobility: ["step-free"] }),
    );

    expect(result.excluded).toBe(true);
  });

  it("does not turn a step-free tag into a wheelchair-access claim", () => {
    const result = evaluateCandidate(
      candidate({ tags: [stepFreeTag] }),
      makeNeeds({ mobility: ["wheelchair"] }),
    );

    expect(result.fit[0]).toMatchObject({ need: "Wheelchair access", label: "ask" });
  });

  it("reports wheelchair access only when a wheelchair-specific tag exists", () => {
    const result = evaluateCandidate(
      candidate({ tags: [wheelchairTag] }),
      makeNeeds({ mobility: ["wheelchair"] }),
    );

    expect(result.fit[0]).toMatchObject({ need: "Wheelchair access", label: "reported" });
  });

  it("reports step-free access from a wheelchair or step-free tag", () => {
    for (const tag of [stepFreeTag, wheelchairTag]) {
      const result = evaluateCandidate(
        candidate({ tags: [tag] }),
        makeNeeds({ mobility: ["step-free"] }),
      );
      expect(result.fit[0]).toMatchObject({
        need: "Step-free entrance",
        label: "reported",
      });
    }
  });

  it("never labels hearing or low-vision support as likely", () => {
    for (const mobility of ["hearing-friendly", "low-vision-friendly"] as const) {
      const result = evaluateCandidate(candidate(), makeNeeds({ mobility: [mobility] }));
      expect(result.fit[0]?.label).toBe("ask");
    }
  });

  it("labels quiet and lively rooms from tags, and asks otherwise", () => {
    const quiet = evaluateCandidate(
      candidate({ tags: [quietTag] }),
      makeNeeds({ noise: "quiet" }),
    );
    expect(quiet.fit[0]).toMatchObject({ need: "Quiet room", label: "reported" });

    const livelyAsQuiet = evaluateCandidate(
      candidate({ tags: [livelyTag] }),
      makeNeeds({ noise: "quiet" }),
    );
    expect(livelyAsQuiet.fit[0]?.label).toBe("ask");

    const lively = evaluateCandidate(
      candidate({ tags: [livelyTag] }),
      makeNeeds({ noise: "lively" }),
    );
    expect(lively.fit[0]).toMatchObject({ need: "Lively room", label: "reported" });

    const moderate = evaluateCandidate(candidate(), makeNeeds({ noise: "moderate" }));
    expect(moderate.fit[0]?.label).toBe("ask");
  });

  it("uses taste affinity alone when no needs are selected", () => {
    const result = evaluateCandidate(candidate({ affinity: 0.42 }), makeNeeds());
    expect(result.fit).toHaveLength(0);
    expect(result.score).toBeCloseTo(0.42, 3);
  });

  it("falls back to a neutral affinity when Qloo gives none", () => {
    const withNeeds = evaluateCandidate(candidate({ affinity: null }), makeNeeds({ texture: "soft" }));
    const withoutNeeds = evaluateCandidate(candidate({ affinity: null }), makeNeeds());
    expect(withNeeds.score).toBeGreaterThan(0);
    expect(withoutNeeds.score).toBeCloseTo(0.5, 3);
  });

  it("emits each selected need exactly once for a persona profile", () => {
    const result = evaluateCandidate(
      candidate({ tags: [quietTag, stepFreeTag] }),
      makeNeeds({
        texture: "soft",
        sodium: "lower",
        diet: ["diabetic-friendly"],
        noise: "quiet",
        mobility: ["step-free"],
      }),
    );

    const needs = result.fit.map((item) => item.need);
    expect(new Set(needs).size).toBe(needs.length);
    expect(needs).toHaveLength(5);
  });
});

describe("applySeniorFit", () => {
  it("excludes unsafe-by-tag candidates, sorts by score, and respects the limit", () => {
    const high = candidate({ id: "high", affinity: 0.95, tags: [quietTag, wheelchairTag] });
    const low = candidate({ id: "low", affinity: 0.2 });
    const excluded = candidate({ id: "excluded", affinity: 0.99, tags: [notWheelchairTag] });

    const ranked = applySeniorFit(
      [low, excluded, high],
      makeNeeds({ noise: "quiet", mobility: ["wheelchair"] }),
      5,
    );

    expect(ranked.map((entry) => entry.candidate.id)).toEqual(["high", "low"]);
    expect(ranked[0]?.fit).toHaveLength(2);
    expect(ranked[1]?.fit).toHaveLength(2);
  });

  it("returns at most the requested number of cards", () => {
    const places = Array.from({ length: 8 }, (_, index) =>
      candidate({ id: `place-${index}`, affinity: 0.9 - index * 0.05 }),
    );
    expect(applySeniorFit(places, makeNeeds(), 5)).toHaveLength(5);
  });
});
