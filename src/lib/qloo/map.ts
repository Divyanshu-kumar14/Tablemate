import type { PlaceCandidate, QlooSignal, TagRef, TasteSeed } from "@/types/domain";
import type { RawEntity, RawTag } from "@/lib/qloo/raw";

const CUISINE_MATCHERS: Array<{ slug: string; display: string; aliases: string[] }> = [
  { slug: "middle_eastern", display: "Middle Eastern", aliases: ["middle eastern", "lebanese", "turkish", "persian"] },
  { slug: "mediterranean", display: "Mediterranean", aliases: ["mediterranean"] },
  { slug: "vietnamese", display: "Vietnamese", aliases: ["vietnamese", "pho"] },
  { slug: "japanese", display: "Japanese", aliases: ["japanese", "sushi", "udon", "izakaya"] },
  { slug: "italian", display: "Italian", aliases: ["italian", "trattoria", "osteria", "pasta"] },
  { slug: "chinese", display: "Chinese", aliases: ["chinese", "dim sum", "congee", "szechuan", "cantonese"] },
  { slug: "indian", display: "Indian", aliases: ["indian", "dosa", "curry house", "tandoor"] },
  { slug: "thai", display: "Thai", aliases: ["thai"] },
  { slug: "mexican", display: "Mexican", aliases: ["mexican", "taqueria", "cantina"] },
  { slug: "greek", display: "Greek", aliases: ["greek", "taverna"] },
  { slug: "korean", display: "Korean", aliases: ["korean", "kimchi"] },
  { slug: "spanish", display: "Spanish", aliases: ["spanish", "tapas"] },
  { slug: "seafood", display: "Seafood", aliases: ["seafood", "fish house", "oyster"] },
  { slug: "french", display: "French", aliases: ["french", "bistro", "brasserie"] },
  { slug: "american", display: "American", aliases: ["american", "diner", "grill", "kitchen"] },
];

const NON_DINING_TAG_PATTERNS = [
  /\bchurch\b/i,
  /\bchapel\b/i,
  /\bepiscopal_church\b/i,
  /\bcatholic_church\b/i,
  /\bplace_of_worship\b/i,
  /\bsynagogue\b/i,
  /\bmosque\b/i,
  /\btemple\b/i,
  /\breligious_spiritual\b/i,
  /\bgraveyard\b/i,
  /\bcemetery\b/i,
  /\bmemorials?\b/i,
  /\bcrematorium\b/i,
  /\bfuneral\b/i,
  /\belementary_school\b/i,
  /\bhigh_school\b/i,
  /\bpolice_station\b/i,
  /\bgas_station\b/i,
  /\bparking_garage\b/i,
  /\btransit_station\b/i,
  /\bsubway_station\b/i,
  /\bcourthouse\b/i,
];

const NON_DINING_NAME_PATTERNS = [
  /\bchapel\b/i,
  /\bchurch\b/i,
  /\bcemetery\b/i,
  /\bgraveyard\b/i,
  /\bcathedral\b/i,
  /\bsynagogue\b/i,
  /\bmosque\b/i,
  /\btemple\b/i,
  /\bmemorial\b/i,
  /\bmortuary\b/i,
  /\bcrematorium\b/i,
  /\bmausoleum\b/i,
];

const DINING_TAG_PATTERNS = [
  /restaurant/i,
  /dining/i,
  /cuisine/i,
  /food/i,
  /cafe|café/i,
  /bistro/i,
  /bakery/i,
  /bar/i,
  /pub/i,
  /tavern/i,
  /brasserie/i,
  /eatery/i,
  /deli/i,
  /pizzeria/i,
  /steakhouse/i,
  /trattoria/i,
  /osteria/i,
  /grill/i,
  /diner/i,
  /sushi/i,
  /ramen/i,
  /noodle/i,
  /bbq/i,
  /brewery/i,
  /winery/i,
];

const CIVIC_OR_ATTRACTION_TAG_PATTERNS = [
  /tourist_attraction/i,
  /sightseeing/i,
  /museum/i,
  /monument/i,
  /art_gallery/i,
  /park/i,
  /historical_preservation/i,
];

export function isDiningVenue(name: string, tags: TagRef[]): boolean {
  for (const pattern of NON_DINING_NAME_PATTERNS) {
    if (pattern.test(name)) return false;
  }

  for (const tag of tags) {
    const tagText = `${tag.id} ${tag.name}`;
    for (const pattern of NON_DINING_TAG_PATTERNS) {
      if (pattern.test(tagText)) return false;
    }
  }

  const hasAttractionTag = tags.some((tag) =>
    CIVIC_OR_ATTRACTION_TAG_PATTERNS.some((pattern) => pattern.test(`${tag.id} ${tag.name}`)),
  );
  if (hasAttractionTag) {
    const hasDiningTag = tags.some((tag) =>
      DINING_TAG_PATTERNS.some((pattern) => pattern.test(`${tag.id} ${tag.name}`)),
    );
    const hasDiningName = DINING_TAG_PATTERNS.some((pattern) => pattern.test(name));
    if (!hasDiningTag && !hasDiningName) return false;
  }

  return true;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function firstString(value: unknown): string | null {
  if (Array.isArray(value)) {
    for (const entry of value) {
      const found = asString(entry);
      if (found) return found;
    }
    return null;
  }
  return asString(value);
}

export function mapRawTag(tag: RawTag): TagRef | null {
  const id = asString(tag.id);
  const name = asString(tag.name);
  if (!id && !name) return null;
  return { id: id ?? name ?? "", name: name ?? id ?? "Tag", type: asString(tag.type) ?? "" };
}

export function readAddress(properties: Record<string, unknown>): string {
  const direct = asString(properties.address) ?? asString(properties.full_address);
  if (direct) return direct;

  const address = asRecord(properties.address);
  if (address) {
    const parts = [
      asString(address.line1),
      asString(address.street),
      asString(address.city),
      asString(address.region),
      asString(address.postal_code),
    ].filter((part): part is string => Boolean(part));
    if (parts.length) return parts.join(", ");
  }

  const geocode = asRecord(properties.geocode);
  if (geocode) {
    const parts = [
      asString(geocode.name),
      asString(geocode.admin1_region),
      asString(geocode.country_code),
    ].filter((part): part is string => Boolean(part));
    if (parts.length) return parts.join(", ");
  }

  return "Address not listed";
}

export function readPhone(properties: Record<string, unknown>): string | null {
  return (
    firstString(properties.phone) ??
    firstString(properties.telephone) ??
    firstString(properties.formatted_phone_number) ??
    firstString(properties.international_phone_number)
  );
}

export function readPriceLevel(properties: Record<string, unknown>): string | null {
  const numeric = asNumber(properties.price_level);
  if (numeric !== null && numeric >= 1 && numeric <= 4) return "$".repeat(Math.round(numeric));
  return asString(properties.price_level) ?? asString(properties.price_range);
}

export function readImageUrl(properties: Record<string, unknown>): string | null {
  const image = properties.image;
  if (typeof image === "string") return image;
  const imageRecord = asRecord(image);
  const imageUrl = imageRecord ? asString(imageRecord.url) : null;
  if (imageUrl) return imageUrl;

  const direct = asString(properties.image_url);
  if (direct) return direct;

  if (Array.isArray(properties.photos)) {
    for (const photo of properties.photos) {
      const record = asRecord(photo);
      const url = record ? asString(record.url) : null;
      if (url) return url;
    }
  }
  return null;
}

export function inferCuisine(name: string, tags: TagRef[]): string {
  // Filter out decor, architectural, and unrelated tags so "American primitive decor"
  // doesn't falsely classify a venue as an American restaurant.
  const cuisineRelevantTags = tags.filter((tag) => {
    const combined = `${tag.type} ${tag.id}`.toLowerCase();
    return !(
      combined.includes(":decor:") ||
      combined.includes(":setting:") ||
      combined.includes(":interests:") ||
      combined.includes(":nearby_attraction:") ||
      combined.includes(":amenities:") ||
      combined.includes(":parking:") ||
      combined.includes(":payment")
    );
  });

  const tagHaystack = cuisineRelevantTags
    .map((tag) => `${tag.name} ${tag.id}`)
    .join(" ")
    .toLowerCase();

  for (const cuisine of CUISINE_MATCHERS) {
    for (const alias of cuisine.aliases) {
      const aliasRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (aliasRegex.test(tagHaystack)) return cuisine.display;
    }
  }

  for (const cuisine of CUISINE_MATCHERS) {
    for (const alias of cuisine.aliases) {
      const aliasRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
      if (aliasRegex.test(name)) return cuisine.display;
    }
  }

  return "Restaurant";
}

export function readAffinity(entity: RawEntity): number | null {
  const measurements = asRecord(entity.query?.measurements);
  const fromQuery = measurements ? asNumber(measurements.affinity) : null;
  if (fromQuery !== null) return fromQuery;
  const direct = asNumber(entity.affinity);
  if (direct !== null) return direct;
  const properties = asRecord(entity.properties);
  return properties ? asNumber(properties.affinity) : null;
}

export function summarizeExplainability(value: unknown): Array<{ name: string; score: number }> {
  const found: Array<{ name: string; score: number }> = [];
  const seen = new Set<string>();

  function visit(node: unknown, depth: number) {
    if (depth > 5 || found.length >= 6) return;
    if (Array.isArray(node)) {
      for (const entry of node) visit(entry, depth + 1);
      return;
    }
    const record = asRecord(node);
    if (!record) return;

    const name = asString(record.name) ?? asString(record.entity_name) ?? asString(record.id);
    const score =
      asNumber(record.score) ??
      asNumber(record.weight) ??
      asNumber(record.affinity) ??
      asNumber(record.value);
    if (name && score !== null && !seen.has(name)) {
      seen.add(name);
      found.push({ name, score });
    }

    for (const key of ["signal", "entities", "tags", "interests", "matched", "explainability"]) {
      if (key in record) visit(record[key], depth + 1);
    }
    for (const entry of Object.values(record)) {
      if (entry && typeof entry === "object") visit(entry, depth + 1);
    }
  }

  visit(value, 0);
  return found.sort((a, b) => b.score - a.score).slice(0, 4);
}

export function buildSignals(entity: {
  tags: TagRef[];
  popularity: number;
  explainability: unknown;
}, seeds: TasteSeed[]): QlooSignal[] {
  const signals: QlooSignal[] = [];
  const explained = summarizeExplainability(entity.explainability);
  if (explained.length) {
    signals.push({
      source: "qloo_insights",
      detail: `Qloo affinity from ${explained
        .slice(0, 2)
        .map((item) => item.name)
        .join(" and ")}`,
    });
  } else if (seeds.length) {
    signals.push({
      source: "qloo_insights",
      detail: `Affinity from ${seeds
        .slice(0, 2)
        .map((seed) => seed.name)
        .join(" and ")}`,
    });
  }

  const notable = entity.tags.find((tag) =>
    /quiet|intimate|wheelchair|step.?free|accessible/i.test(`${tag.name} ${tag.id}`),
  );
  if (notable) {
    signals.push({ source: "qloo_tags", detail: `Tag: ${notable.name}` });
  }

  if (entity.popularity > 0) {
    signals.push({
      source: "qloo_insights",
      detail: `Popularity ${Math.round(entity.popularity * 100)}/100`,
    });
  }

  return signals.slice(0, 3);
}

export function mapRawEntity(raw: RawEntity, seeds: TasteSeed[] = []): PlaceCandidate | null {
  const id = asString(raw.entity_id);
  const name = asString(raw.name);
  if (!id || !name) return null;

  const properties = asRecord(raw.properties) ?? {};
  const tags = (raw.tags ?? [])
    .map(mapRawTag)
    .filter((tag): tag is TagRef => Boolean(tag));

  if (!isDiningVenue(name, tags)) return null;

  const popularity = asNumber(raw.popularity) ?? 0;
  const explainability = raw.query?.explainability ?? null;

  return {
    id,
    name,
    cuisine: inferCuisine(name, tags),
    address: readAddress(properties),
    phone: readPhone(properties),
    priceLevel: readPriceLevel(properties),
    imageUrl: readImageUrl(properties),
    tags,
    popularity,
    affinity: readAffinity(raw),
    explainability,
    signals: buildSignals({ tags, popularity, explainability }, seeds),
  };
}
