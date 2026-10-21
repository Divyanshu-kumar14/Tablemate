import { describe, expect, it } from "vitest";
import type { RawEntity, RawSearchResponse, RawTagResponse } from "@/lib/qloo/raw";
import {
  buildSignals,
  inferCuisine,
  mapRawEntity,
  mapRawTag,
  readAddress,
  readAffinity,
  readImageUrl,
  readPhone,
  readPriceLevel,
  summarizeExplainability,
} from "@/lib/qloo/map";
import {
  extractInsightEntities,
  extractSearchEntities,
  extractTags,
} from "@/lib/qloo/raw";
import { mapSearchResponse, mapTagResponse } from "@/lib/qloo/client";

const rawEntity: RawEntity = {
  entity_id: "urn:entity:place:test-1",
  name: "Trattoria Test",
  type: "urn:entity:place",
  properties: {
    address: {
      line1: "1 Main Street",
      city: "Brooklyn",
      region: "NY",
      postal_code: "11201",
    },
    phone: ["+1 718 555 0100"],
    price_level: 2,
    image: { url: "https://example.com/photo.jpg" },
  },
  tags: [
    { id: "urn:tag:genre:place:italian", name: "Italian", type: "urn:tag:genre:place" },
    { id: "urn:tag:ambience:qloo:quiet", name: "Quiet", type: "urn:tag:ambience:qloo" },
  ],
  popularity: 0.82,
  query: {
    measurements: { affinity: 0.91 },
    explainability: {
      signal: {
        entities: [
          { name: "Miles Davis", score: 0.8 },
          { name: "Casablanca", score: 0.7 },
        ],
      },
    },
  },
};

describe("raw parsers", () => {
  it("reads direct, structured, and geocoded addresses", () => {
    expect(readAddress({ address: "1 Main St, Brooklyn, NY" })).toBe("1 Main St, Brooklyn, NY");
    expect(
      readAddress({
        address: {
          line1: "1 Main Street",
          city: "Brooklyn",
          region: "NY",
          postal_code: "11201",
        },
      }),
    ).toBe("1 Main Street, Brooklyn, NY, 11201");
    expect(
      readAddress({ geocode: { name: "Brooklyn", admin1_region: "NY", country_code: "US" } }),
    ).toBe("Brooklyn, NY, US");
    expect(readAddress({})).toBe("Address not listed");
  });

  it("reads phone numbers from several field names and array shapes", () => {
    expect(readPhone({ phone: ["+1 718 555 0100"] })).toBe("+1 718 555 0100");
    expect(readPhone({ telephone: "+1 212 555 0100" })).toBe("+1 212 555 0100");
    expect(readPhone({ formatted_phone_number: "555-0100" })).toBe("555-0100");
    expect(readPhone({})).toBeNull();
  });

  it("formats numeric and string price levels", () => {
    expect(readPriceLevel({ price_level: 3 })).toBe("$$$");
    expect(readPriceLevel({ price_level: "$$" })).toBe("$$");
    expect(readPriceLevel({ price_range: "$$$" })).toBe("$$$");
    expect(readPriceLevel({ price_level: 0 })).toBeNull();
    expect(readPriceLevel({ price_level: 9 })).toBeNull();
  });

  it("reads image URLs from strings, nested objects, and photos", () => {
    expect(readImageUrl({ image: "https://example.com/a.jpg" })).toBe(
      "https://example.com/a.jpg",
    );
    expect(readImageUrl({ image: { url: "https://example.com/b.jpg" } })).toBe(
      "https://example.com/b.jpg",
    );
    expect(readImageUrl({ photos: [{ url: "https://example.com/c.jpg" }] })).toBe(
      "https://example.com/c.jpg",
    );
    expect(readImageUrl({})).toBeNull();
  });

  it("reads affinity from query measurements, direct fields, and properties", () => {
    expect(readAffinity({ query: { measurements: { affinity: 0.7 } } })).toBe(0.7);
    expect(readAffinity({ affinity: 0.5 })).toBe(0.5);
    expect(readAffinity({ properties: { affinity: 0.4 } })).toBe(0.4);
    expect(readAffinity({})).toBeNull();
  });

  it("maps tags with sensible fallbacks", () => {
    expect(mapRawTag({ id: "urn:tag:1", name: "Quiet", type: "urn:tag:ambience" })).toEqual({
      id: "urn:tag:1",
      name: "Quiet",
      type: "urn:tag:ambience",
    });
    expect(mapRawTag({ name: "Quiet" })).toEqual({ id: "Quiet", name: "Quiet", type: "" });
    expect(mapRawTag({ id: "urn:tag:1" })).toEqual({
      id: "urn:tag:1",
      name: "urn:tag:1",
      type: "",
    });
    expect(mapRawTag({})).toBeNull();
  });
});

describe("cuisine inference", () => {
  it("prefers explicit cuisine tags over the venue name", () => {
    expect(
      inferCuisine("The Corner Table", [
        { id: "urn:tag:genre:place:middle_eastern", name: "Middle Eastern", type: "" },
      ]),
    ).toBe("Middle Eastern");
  });

  it("uses common name patterns", () => {
    expect(inferCuisine("Sakura Sushi", [])).toBe("Japanese");
    expect(inferCuisine("Osteria Lago", [])).toBe("Italian");
    expect(inferCuisine("Taqueria Verde", [])).toBe("Mexican");
    expect(inferCuisine("Unknown Room", [])).toBe("Restaurant");
  });
});

describe("affinity and signals", () => {
  it("extracts explained entities, sorted and deduplicated", () => {
    const result = summarizeExplainability({
      signal: {
        entities: [
          { name: "Miles Davis", score: 0.6 },
          { name: "Casablanca", score: 0.9 },
          { name: "Miles Davis", score: 0.8 },
        ],
      },
    });

    expect(result[0]).toEqual({ name: "Casablanca", score: 0.9 });
    expect(result.filter((item) => item.name === "Miles Davis")).toHaveLength(1);
  });

  it("builds readable signals from explainability, tags, and popularity", () => {
    const signals = buildSignals(
      {
        tags: [
          { id: "urn:tag:ambience:qloo:quiet", name: "Quiet", type: "" },
          { id: "urn:tag:genre:place:italian", name: "Italian", type: "" },
        ],
        popularity: 0.82,
        explainability: {
          signal: { entities: [{ name: "Miles Davis", score: 0.8 }] },
        },
      },
      [],
    );

    expect(signals[0]?.detail).toContain("Miles Davis");
    expect(signals[1]?.detail).toBe("Tag: Quiet");
    expect(signals[2]?.detail).toBe("Popularity 82/100");
    expect(signals).toHaveLength(3);
  });

  it("falls back to the taste seeds when explainability is absent", () => {
    const signals = buildSignals(
      { tags: [], popularity: 0, explainability: null },
      [
        { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" },
        { name: "Casablanca", type: "movie", qlooId: "mock:movie:casablanca" },
      ],
    );

    expect(signals).toHaveLength(1);
    expect(signals[0]?.detail).toContain("Miles Davis and Casablanca");
  });
});

describe("mapRawEntity", () => {
  it("maps a full Qloo entity without inventing missing fields", () => {
    const candidate = mapRawEntity(rawEntity, [
      { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis" },
    ]);

    expect(candidate).not.toBeNull();
    expect(candidate).toMatchObject({
      id: "urn:entity:place:test-1",
      name: "Trattoria Test",
      cuisine: "Italian",
      address: "1 Main Street, Brooklyn, NY, 11201",
      phone: "+1 718 555 0100",
      priceLevel: "$$",
      imageUrl: "https://example.com/photo.jpg",
      popularity: 0.82,
      affinity: 0.91,
    });
    expect(candidate?.signals.length).toBeGreaterThan(0);
  });

  it("returns null when the entity has no id or name", () => {
    expect(mapRawEntity({ name: "No id" })).toBeNull();
    expect(mapRawEntity({ entity_id: "urn:entity:place:missing-name" })).toBeNull();
  });

  it("uses honest placeholders for missing venue facts", () => {
    const candidate = mapRawEntity({
      entity_id: "urn:entity:place:minimal",
      name: "Minimal Cafe",
      tags: [],
    });

    expect(candidate).toMatchObject({
      address: "Address not listed",
      phone: null,
      priceLevel: null,
      imageUrl: null,
      cuisine: "Restaurant",
      affinity: null,
      popularity: 0,
    });
  });
});

describe("Qloo response mapping", () => {
  it("extracts entities from both documented result shapes", () => {
    expect(extractSearchEntities({ results: [rawEntity] })).toHaveLength(1);
    expect(extractSearchEntities({ results: { entities: [rawEntity] } })).toHaveLength(1);
    expect(extractInsightEntities({ results: { entities: [rawEntity] } })).toHaveLength(1);
    expect(extractInsightEntities({ results: {} })).toEqual([]);
  });

  it("extracts tags from both documented result shapes", () => {
    expect(extractTags({ results: { tags: [{ id: "1", name: "Quiet" }] } })).toHaveLength(1);
    expect(extractTags({ results: [{ id: "1", name: "Quiet" }] })).toHaveLength(1);
    expect(extractTags({ results: {} })).toEqual([]);
  });

  it("maps search results and applies the requested type", () => {
    const payload: RawSearchResponse = {
      results: [
        { ...rawEntity, subtype: "urn:entity:place" },
        { entity_id: "urn:entity:artist:1", name: "Miles Davis", subtype: "urn:entity:artist" },
        { name: "No id" },
      ],
    };

    const results = mapSearchResponse(payload, "artist");
    expect(results).toHaveLength(2);
    expect(results.every((result) => result.type === "artist")).toBe(true);
    expect(results.every((result) => result.subtitle === "From Qloo")).toBe(true);
  });

  it("infers a search result type from the subtype when none is requested", () => {
    const results = mapSearchResponse({
      results: [
        { entity_id: "urn:entity:artist:1", name: "Miles Davis", subtype: "urn:entity:artist" },
        { entity_id: "urn:entity:movie:1", name: "Casablanca", subtype: "urn:entity:movie" },
        { entity_id: "urn:entity:tv:1", name: "Columbo", subtype: "urn:entity:tv_show" },
        { entity_id: "urn:entity:place:1", name: "A Cafe", subtype: "urn:entity:place" },
      ],
    });

    expect(results.map((result) => result.type)).toEqual([
      "artist",
      "movie",
      "tv",
      "restaurant",
    ]);
  });

  it("maps tag results to cuisine seeds and filters incomplete tags", () => {
    const payload: RawTagResponse = {
      results: {
        tags: [
          { id: "urn:tag:genre:place:italian", name: "Italian" },
          { id: "urn:tag:genre:place:thai", name: "Thai" },
          { id: "urn:tag:genre:place:broken" },
        ],
      },
    };

    const results = mapTagResponse(payload);
    expect(results).toHaveLength(2);
    expect(results[0]).toMatchObject({ name: "Italian", type: "cuisine" });
  });
});
