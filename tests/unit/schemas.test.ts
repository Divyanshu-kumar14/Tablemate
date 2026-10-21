import { describe, expect, it } from "vitest";
import {
  recommendRequestSchema,
  searchQuerySchema,
  validationDetails,
} from "@/lib/schemas";

const validRequest = {
  location: "Brooklyn, NY",
  taste: [
    { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" },
    { name: "Italian", type: "cuisine", qlooId: "urn:tag:genre:place:italian" },
  ],
  needs: {
    texture: "soft",
    sodium: "lower",
    diet: ["diabetic-friendly"],
    noise: "quiet",
    mobility: ["step-free"],
    note: "Loves a quiet corner.",
  },
};

describe("recommendRequestSchema", () => {
  it("accepts a complete persona-style request and applies defaults", () => {
    const parsed = recommendRequestSchema.parse(validRequest);
    expect(parsed.limit).toBe(5);
    expect(parsed.needs.diet).toEqual(["diabetic-friendly"]);
    expect(parsed.needs.mobility).toEqual(["step-free"]);
    expect(parsed.taste).toHaveLength(2);
  });

  it("fills empty arrays and an optional noise value", () => {
    const parsed = recommendRequestSchema.parse({
      location: "Edison, NJ",
      taste: [{ name: "Indian", type: "cuisine", qlooId: "urn:tag:genre:place:indian" }],
      needs: { texture: "regular", sodium: "no-preference" },
    });

    expect(parsed.needs.diet).toEqual([]);
    expect(parsed.needs.mobility).toEqual([]);
    expect(parsed.needs.noise).toBeUndefined();
    expect(parsed.limit).toBe(5);
  });

  it("rejects an empty taste list", () => {
    const result = recommendRequestSchema.safeParse({ ...validRequest, taste: [] });
    expect(result.success).toBe(false);
  });

  it("rejects more than five taste seeds", () => {
    const result = recommendRequestSchema.safeParse({
      ...validRequest,
      taste: Array.from({ length: 6 }, (_, index) => ({
        name: `Seed ${index}`,
        type: "artist",
        qlooId: `mock:artist:${index}`,
      })),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a blank or oversized location", () => {
    expect(recommendRequestSchema.safeParse({ ...validRequest, location: "   " }).success).toBe(
      false,
    );
    expect(
      recommendRequestSchema.safeParse({ ...validRequest, location: "x".repeat(81) }).success,
    ).toBe(false);
  });

  it("rejects unknown root and needs fields", () => {
    expect(
      recommendRequestSchema.safeParse({ ...validRequest, surprise: true }).success,
    ).toBe(false);
    expect(
      recommendRequestSchema.safeParse({
        ...validRequest,
        needs: { ...validRequest.needs, diagnosis: "dysphagia" },
      }).success,
    ).toBe(false);
  });

  it("rejects invalid enum values and out-of-range limits", () => {
    expect(
      recommendRequestSchema.safeParse({
        ...validRequest,
        needs: { ...validRequest.needs, texture: "mashed" },
      }).success,
    ).toBe(false);
    expect(recommendRequestSchema.safeParse({ ...validRequest, limit: 2 }).success).toBe(false);
    expect(recommendRequestSchema.safeParse({ ...validRequest, limit: 6 }).success).toBe(false);
    expect(recommendRequestSchema.safeParse({ ...validRequest, limit: 3 }).success).toBe(true);
  });

  it("accepts five taste seeds and rejects a missing qloo id", () => {
    expect(
      recommendRequestSchema.safeParse({
        ...validRequest,
        taste: Array.from({ length: 5 }, (_, index) => ({
          name: `Seed ${index}`,
          type: "artist",
          qlooId: `mock:artist:${index}`,
        })),
      }).success,
    ).toBe(true);
    expect(
      recommendRequestSchema.safeParse({
        ...validRequest,
        taste: [{ name: "Miles Davis", type: "artist", qlooId: "" }],
      }).success,
    ).toBe(false);
  });

  it("strips control characters from the optional note", () => {
    const parsed = recommendRequestSchema.parse({
      ...validRequest,
      needs: { ...validRequest.needs, note: "quiet\u0000corner\u001fplease" },
    });
    expect(parsed.needs.note).toBe("quiet corner please");
  });

  it("rejects a note longer than 200 characters", () => {
    const result = recommendRequestSchema.safeParse({
      ...validRequest,
      needs: { ...validRequest.needs, note: "x".repeat(201) },
    });
    expect(result.success).toBe(false);
  });
});

describe("searchQuerySchema", () => {
  it("accepts a query with an optional type", () => {
    expect(searchQuerySchema.parse({ q: "Miles" })).toEqual({ q: "Miles" });
    expect(searchQuerySchema.parse({ q: "Italian", type: "cuisine" })).toEqual({
      q: "Italian",
      type: "cuisine",
    });
  });

  it("rejects blank, oversized, and unknown types", () => {
    expect(searchQuerySchema.safeParse({ q: "" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: "x".repeat(61) }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: "Miles", type: "book" }).success).toBe(false);
    expect(searchQuerySchema.safeParse({ q: "Miles", extra: true }).success).toBe(false);
  });
});

describe("validationDetails", () => {
  it("returns field-level details for the client", () => {
    const result = recommendRequestSchema.safeParse({
      ...validRequest,
      location: "",
      needs: { ...validRequest.needs, texture: "mashed" },
    });
    expect(result.success).toBe(false);
    if (result.success) return;

    const details = validationDetails(result.error);
    expect(details.some((detail) => detail.field === "location")).toBe(true);
    expect(details.some((detail) => detail.field === "needs.texture")).toBe(true);
    for (const detail of details) {
      expect(detail.message.length).toBeGreaterThan(0);
      expect(detail.code.length).toBeGreaterThan(0);
    }
  });
});
