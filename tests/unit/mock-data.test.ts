import { describe, expect, it } from "vitest";
import {
  MOCK_PLACES,
  fallbackPlacesForLocation,
  mockAffinity,
  mockPlacesForLocation,
  withMockSignals,
} from "@/data/mock-places";
import { MOCK_CATALOG, mockSearch } from "@/data/mock-catalog";
import { PERSONAS, getPersona } from "@/data/personas";

describe("personas", () => {
  it("ships the three demo personas", () => {
    expect(PERSONAS).toHaveLength(3);
    expect(PERSONAS.map((persona) => persona.id)).toEqual(["p1", "p2", "p3"]);
    expect(getPersona("p1")?.name).toBe("Sylvia");
    expect(getPersona("p2")?.name).toBe("Raj");
    expect(getPersona("p3")?.name).toBe("Margaret");
    expect(getPersona("p9")).toBeNull();
    expect(getPersona(null)).toBeNull();
  });

  it("gives every persona three taste signals and a complete needs profile", () => {
    for (const persona of PERSONAS) {
      expect(persona.taste).toHaveLength(3);
      expect(persona.location.length).toBeGreaterThan(0);
      expect(persona.needs.texture).toBeTruthy();
      expect(persona.needs.sodium).toBeTruthy();
      expect(Array.isArray(persona.needs.diet)).toBe(true);
      expect(Array.isArray(persona.needs.mobility)).toBe(true);
    }
  });

  it("keeps the persona profiles faithful to the PRD", () => {
    const sylvia = getPersona("p1");
    expect(sylvia?.needs).toMatchObject({
      texture: "soft",
      sodium: "lower",
      diet: ["diabetic-friendly"],
      noise: "quiet",
      mobility: ["step-free"],
    });

    const raj = getPersona("p2");
    expect(raj?.needs).toMatchObject({
      texture: "regular",
      sodium: "no-preference",
      diet: ["diabetic-friendly"],
      noise: "moderate",
      mobility: [],
    });

    const margaret = getPersona("p3");
    expect(margaret?.needs).toMatchObject({
      texture: "very-soft",
      sodium: "lower",
      diet: [],
      noise: "quiet",
      mobility: ["wheelchair"],
    });
  });
});

describe("mock venues", () => {
  it("has unique ids and no real phone numbers", () => {
    expect(new Set(MOCK_PLACES.map((place) => place.id)).size).toBe(MOCK_PLACES.length);
    expect(MOCK_PLACES.every((place) => place.phone === null)).toBe(true);
    expect(MOCK_PLACES.every((place) => place.imageUrl === null)).toBe(true);
  });

  it("covers the three demo cities", () => {
    expect(mockPlacesForLocation("Brooklyn, NY")).toHaveLength(6);
    expect(mockPlacesForLocation("Edison, NJ")).toHaveLength(5);
    expect(mockPlacesForLocation("Chicago, IL")).toHaveLength(5);
    expect(mockPlacesForLocation("Austin, TX")).toEqual([]);
  });

  it("matches state abbreviations without matching arbitrary text", () => {
    expect(mockPlacesForLocation("somewhere in ny")).toHaveLength(6);
    expect(mockPlacesForLocation("Edison")).toHaveLength(5);
    expect(mockPlacesForLocation("Chicago")).toHaveLength(5);
    expect(mockPlacesForLocation("nyc")).toEqual([]);
  });

  it("falls back to Brooklyn venues for unknown locations", () => {
    const fallback = fallbackPlacesForLocation("Austin, TX");
    expect(fallback).toHaveLength(6);
    expect(fallback.every((place) => place.address.includes(", NY "))).toBe(true);
  });

  it("adds clearly labeled sample signals and deterministic affinity", () => {
    const seeds = [
      { name: "Miles Davis", type: "artist" as const, qlooId: "mock:artist:miles-davis" },
    ];
    const enriched = withMockSignals(MOCK_PLACES.slice(0, 2), seeds);

    expect(enriched.every((place) => place.signals.every((signal) => signal.source === "fallback"))).toBe(
      true,
    );
    expect(enriched.every((place) => place.signals[0]?.detail.includes("Sample affinity"))).toBe(
      true,
    );
    expect(enriched.every((place) => (place.affinity ?? 0) >= 0 && (place.affinity ?? 0) <= 1)).toBe(
      true,
    );
    expect(mockAffinity(MOCK_PLACES[0]!, seeds)).toBe(mockAffinity(MOCK_PLACES[0]!, seeds));
  });

  it("does not mutate the source venues when adding sample signals", () => {
    const source = MOCK_PLACES[0]!;
    withMockSignals([source], []);
    expect(source.affinity).toBeNull();
    expect(source.signals).toEqual([]);
  });
});

describe("mock catalog search", () => {
  it("finds artists, films, cuisines, and restaurants", () => {
    expect(mockSearch("miles", "artist")[0]).toMatchObject({
      name: "Miles Davis",
      type: "artist",
    });
    expect(mockSearch("casablanca", "movie")[0]).toMatchObject({
      name: "Casablanca",
      type: "movie",
    });
    expect(mockSearch("italian", "cuisine")[0]).toMatchObject({
      name: "Italian",
      type: "cuisine",
      qlooId: "urn:tag:genre:place:italian",
    });
    expect(mockSearch("cobble", "restaurant")[0]).toMatchObject({
      name: "Cobble Hill Trattoria",
      type: "restaurant",
    });
  });

  it("returns an empty list for blank or unknown queries", () => {
    expect(mockSearch("")).toEqual([]);
    expect(mockSearch("   ")).toEqual([]);
    expect(mockSearch("zzzzz")).toEqual([]);
  });

  it("respects the requested type and the result limit", () => {
    expect(mockSearch("a", "artist", 2)).toHaveLength(2);
    expect(mockSearch("a", "artist", 2).every((result) => result.type === "artist")).toBe(true);
    expect(MOCK_CATALOG.length).toBeGreaterThan(40);
  });
});
