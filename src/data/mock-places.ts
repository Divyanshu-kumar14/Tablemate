import type { PlaceCandidate, TagRef, TasteSeed } from "@/types/domain";

const t = (id: string, name: string, type: string): TagRef => ({ id, name, type });
const cuisineTag = (slug: string, name: string) =>
  t(`urn:tag:genre:place:${slug}`, name, "urn:tag:genre:place");
const quietTag = t("urn:tag:ambience:qloo:quiet", "Quiet", "urn:tag:ambience:qloo");
const intimateTag = t("urn:tag:ambience:qloo:intimate", "Intimate", "urn:tag:ambience:qloo");
const livelyTag = t("urn:tag:ambience:qloo:lively", "Lively", "urn:tag:ambience:qloo");
const wheelchairTag = t(
  "urn:tag:accessibility:place:wheelchair_accessible",
  "Wheelchair accessible",
  "urn:tag:accessibility:place",
);
const stepFreeTag = t(
  "urn:tag:accessibility:place:step_free_entrance",
  "Step-free entrance",
  "urn:tag:accessibility:place",
);
const notWheelchairTag = t(
  "urn:tag:accessibility:place:not_wheelchair_accessible",
  "Not wheelchair accessible",
  "urn:tag:accessibility:place",
);

interface PlaceInput {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  priceLevel: string;
  tags: TagRef[];
  popularity: number;
}

function place(input: PlaceInput): PlaceCandidate {
  return {
    ...input,
    phone: null,
    imageUrl: null,
    affinity: null,
    explainability: null,
    signals: [],
  };
}

/**
 * Fictional venues for the demo and for fallback. They are always labeled
 * "sample data" in the UI. No real phone numbers are used.
 */
export const MOCK_PLACES: PlaceCandidate[] = [
  place({
    id: "mock-place-cobble-hill-trattoria",
    name: "Cobble Hill Trattoria",
    cuisine: "Italian",
    address: "128 Court Street, Brooklyn, NY 11201",
    priceLevel: "$$",
    tags: [cuisineTag("italian", "Italian"), quietTag, intimateTag, stepFreeTag, wheelchairTag],
    popularity: 0.82,
  }),
  place({
    id: "mock-place-sakura-corner",
    name: "Sakura Corner",
    cuisine: "Japanese",
    address: "41 Henry Street, Brooklyn, NY 11201",
    priceLevel: "$$",
    tags: [cuisineTag("japanese", "Japanese"), quietTag, wheelchairTag],
    popularity: 0.88,
  }),
  place({
    id: "mock-place-aegean-table",
    name: "Aegean Table",
    cuisine: "Greek",
    address: "77 Atlantic Avenue, Brooklyn, NY 11201",
    priceLevel: "$$",
    tags: [cuisineTag("greek", "Greek"), quietTag, stepFreeTag],
    popularity: 0.74,
  }),
  place({
    id: "mock-place-willow-diner",
    name: "The Willow Diner",
    cuisine: "American",
    address: "210 Smith Street, Brooklyn, NY 11201",
    priceLevel: "$",
    tags: [cuisineTag("american", "American"), livelyTag, notWheelchairTag],
    popularity: 0.69,
  }),
  place({
    id: "mock-place-golden-congee",
    name: "Golden Congee",
    cuisine: "Chinese",
    address: "58 Bayard Street, Brooklyn, NY 11211",
    priceLevel: "$",
    tags: [cuisineTag("chinese", "Chinese"), quietTag, stepFreeTag],
    popularity: 0.79,
  }),
  place({
    id: "mock-place-masala-house",
    name: "Masala House",
    cuisine: "Indian",
    address: "302 Flatbush Avenue, Brooklyn, NY 11217",
    priceLevel: "$$",
    tags: [cuisineTag("indian", "Indian"), quietTag, wheelchairTag],
    popularity: 0.85,
  }),
  place({
    id: "mock-place-garden-state-dosa",
    name: "Garden State Dosa",
    cuisine: "Indian",
    address: "112 Oak Tree Road, Edison, NJ 08820",
    priceLevel: "$",
    tags: [cuisineTag("indian", "Indian"), stepFreeTag, wheelchairTag],
    popularity: 0.86,
  }),
  place({
    id: "mock-place-thai-orchid-room",
    name: "Thai Orchid Room",
    cuisine: "Thai",
    address: "88 Route 27, Edison, NJ 08820",
    priceLevel: "$$",
    tags: [cuisineTag("thai", "Thai"), quietTag, stepFreeTag],
    popularity: 0.78,
  }),
  place({
    id: "mock-place-nonnas-table",
    name: "Nonna's Table",
    cuisine: "Italian",
    address: "45 Main Street, Edison, NJ 08837",
    priceLevel: "$$",
    tags: [cuisineTag("italian", "Italian"), livelyTag, notWheelchairTag],
    popularity: 0.72,
  }),
  place({
    id: "mock-place-udon-harbor",
    name: "Udon Harbor",
    cuisine: "Japanese",
    address: "19 Amboy Avenue, Edison, NJ 08837",
    priceLevel: "$$",
    tags: [cuisineTag("japanese", "Japanese"), quietTag, wheelchairTag],
    popularity: 0.81,
  }),
  place({
    id: "mock-place-casa-verde",
    name: "Casa Verde",
    cuisine: "Mexican",
    address: "230 Plainfield Avenue, Edison, NJ 08817",
    priceLevel: "$",
    tags: [cuisineTag("mexican", "Mexican"), stepFreeTag],
    popularity: 0.76,
  }),
  place({
    id: "mock-place-lakeview-bistro",
    name: "Lakeview Bistro",
    cuisine: "French",
    address: "3200 North Halsted Street, Chicago, IL 60657",
    priceLevel: "$$$",
    tags: [cuisineTag("french", "French"), quietTag, wheelchairTag, stepFreeTag],
    popularity: 0.84,
  }),
  place({
    id: "mock-place-prairie-table",
    name: "Prairie Table",
    cuisine: "American",
    address: "1450 West Randolph Street, Chicago, IL 60607",
    priceLevel: "$$",
    tags: [cuisineTag("american", "American"), livelyTag, stepFreeTag],
    popularity: 0.77,
  }),
  place({
    id: "mock-place-wicker-park-noodle",
    name: "Wicker Park Noodle",
    cuisine: "Chinese",
    address: "1580 North Milwaukee Avenue, Chicago, IL 60622",
    priceLevel: "$",
    tags: [cuisineTag("chinese", "Chinese"), quietTag, wheelchairTag],
    popularity: 0.73,
  }),
  place({
    id: "mock-place-han-river-kitchen",
    name: "Han River Kitchen",
    cuisine: "Korean",
    address: "620 North Clark Street, Chicago, IL 60654",
    priceLevel: "$$",
    tags: [cuisineTag("korean", "Korean"), quietTag, stepFreeTag],
    popularity: 0.8,
  }),
  place({
    id: "mock-place-osteria-lago",
    name: "Osteria Lago",
    cuisine: "Italian",
    address: "900 North Michigan Avenue, Chicago, IL 60611",
    priceLevel: "$$$",
    tags: [cuisineTag("italian", "Italian"), quietTag, wheelchairTag],
    popularity: 0.87,
  }),
];

function hash(input: string): number {
  let value = 7;
  for (const char of input) value = (value * 31 + char.charCodeAt(0)) >>> 0;
  return value;
}

export function mockAffinity(place: PlaceCandidate, seeds: TasteSeed[]): number {
  const seedText = seeds.map((seed) => seed.name).join("|") || "tablemate";
  const jitter = (hash(`${seedText}:${place.id}`) % 38) / 100;
  const base = seeds.length ? 0.58 : 0.5;
  return Math.min(0.98, Number((base + jitter * 0.7 + place.popularity * 0.12).toFixed(3)));
}

export function withMockSignals(places: PlaceCandidate[], seeds: TasteSeed[]): PlaceCandidate[] {
  return places.map((place) => {
    const seedNames = seeds.slice(0, 2).map((seed) => seed.name).join(" and ");
    const notable = place.tags.find((tag) =>
      /quiet|intimate|wheelchair|step.?free|accessible/i.test(`${tag.name} ${tag.id}`),
    );
    const signals = [
      {
        source: "fallback" as const,
        detail: seedNames
          ? `Sample affinity from ${seedNames} — add a Qloo key for live data`
          : "Sample result — add a Qloo key for live data",
      },
    ];
    if (notable) {
      signals.push({ source: "fallback" as const, detail: `Sample tag: ${notable.name}` });
    }
    return { ...place, affinity: mockAffinity(place, seeds), signals };
  });
}

export function mockPlacesForLocation(location: string): PlaceCandidate[] {
  const value = location.toLowerCase();
  if (value.includes("brooklyn") || value.includes("new york") || /\bny\b/.test(value)) {
    return MOCK_PLACES.filter((place) => place.address.includes(", NY "));
  }
  if (value.includes("edison") || value.includes("new jersey") || /\bnj\b/.test(value)) {
    return MOCK_PLACES.filter((place) => place.address.includes(", NJ "));
  }
  if (value.includes("chicago") || value.includes("illinois") || /\bil\b/.test(value)) {
    return MOCK_PLACES.filter((place) => place.address.includes(", IL "));
  }
  return [];
}

export function fallbackPlacesForLocation(location: string): PlaceCandidate[] {
  const places = mockPlacesForLocation(location);
  if (places.length >= 3) return places;
  return MOCK_PLACES.filter((place) => place.address.includes(", NY "));
}
