import type { SeedType } from "@/types/domain";
import { MOCK_PLACES } from "@/data/mock-places";

export interface SearchResult {
  name: string;
  type: SeedType;
  qlooId: string;
  subtitle: string;
}

interface CatalogEntry extends SearchResult {
  aliases?: string[];
}

const ARTISTS: CatalogEntry[] = [
  { name: "Miles Davis", type: "artist", qlooId: "mock:artist:miles-davis", subtitle: "Jazz trumpeter" },
  { name: "Ravi Shankar", type: "artist", qlooId: "mock:artist:ravi-shankar", subtitle: "Sitar player" },
  { name: "Frank Sinatra", type: "artist", qlooId: "mock:artist:frank-sinatra", subtitle: "Singer" },
  { name: "Ella Fitzgerald", type: "artist", qlooId: "mock:artist:ella-fitzgerald", subtitle: "Jazz singer" },
  { name: "Norah Jones", type: "artist", qlooId: "mock:artist:norah-jones", subtitle: "Singer-songwriter" },
];

const MOVIES: CatalogEntry[] = [
  { name: "Casablanca", type: "movie", qlooId: "mock:movie:casablanca", subtitle: "1942 film" },
  { name: "Pather Panchali", type: "movie", qlooId: "mock:movie:pather-panchali", subtitle: "1955 film" },
  { name: "The Sound of Music", type: "movie", qlooId: "mock:movie:sound-of-music", subtitle: "1965 film" },
  { name: "Rear Window", type: "movie", qlooId: "mock:movie:rear-window", subtitle: "1954 film" },
  { name: "Singin' in the Rain", type: "movie", qlooId: "mock:movie:singin-in-the-rain", subtitle: "1952 film" },
];

const SHOWS: CatalogEntry[] = [
  { name: "Columbo", type: "tv", qlooId: "mock:tv:columbo", subtitle: "Detective series" },
  {
    name: "The Great British Bake Off",
    type: "tv",
    qlooId: "mock:tv:bake-off",
    subtitle: "Baking competition",
  },
];

const CUISINES: Array<{ name: string; slug: string }> = [
  { name: "Italian", slug: "italian" },
  { name: "Indian", slug: "indian" },
  { name: "Japanese", slug: "japanese" },
  { name: "Chinese", slug: "chinese" },
  { name: "Thai", slug: "thai" },
  { name: "Vietnamese", slug: "vietnamese" },
  { name: "Mexican", slug: "mexican" },
  { name: "Greek", slug: "greek" },
  { name: "Mediterranean", slug: "mediterranean" },
  { name: "American", slug: "american" },
  { name: "French", slug: "french" },
  { name: "Korean", slug: "korean" },
  { name: "Spanish", slug: "spanish" },
  { name: "Middle Eastern", slug: "middle_eastern" },
  { name: "Seafood", slug: "seafood" },
];

const CUISINE_ENTRIES: CatalogEntry[] = CUISINES.map((cuisine) => ({
  name: cuisine.name,
  type: "cuisine",
  qlooId: `urn:tag:genre:place:${cuisine.slug}`,
  subtitle: "Cuisine",
  aliases: [cuisine.slug.replace("_", " ")],
}));

const RESTAURANT_ENTRIES: CatalogEntry[] = MOCK_PLACES.map((place) => ({
  name: place.name,
  type: "restaurant",
  qlooId: `mock:place:${place.id}`,
  subtitle: place.cuisine,
}));

export const MOCK_CATALOG: CatalogEntry[] = [
  ...ARTISTS,
  ...MOVIES,
  ...SHOWS,
  ...CUISINE_ENTRIES,
  ...RESTAURANT_ENTRIES,
];

export function mockSearch(query: string, type?: SeedType, limit = 8): SearchResult[] {
  const value = query.trim().toLowerCase();
  if (!value) return [];
  return MOCK_CATALOG.filter((entry) => {
    if (type && entry.type !== type) return false;
    const haystack = `${entry.name} ${entry.subtitle} ${entry.aliases?.join(" ") ?? ""}`.toLowerCase();
    return haystack.includes(value);
  })
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(value) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(value) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .slice(0, limit)
    .map(({ name, type: entryType, qlooId, subtitle }) => ({
      name,
      type: entryType,
      qlooId,
      subtitle,
    }));
}
