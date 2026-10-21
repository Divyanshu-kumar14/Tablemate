import type { PlaceCandidate, TasteSeed } from "@/types/domain";
import { isMockMode } from "@/lib/env";
import {
  extractInsightEntities,
  extractSearchEntities,
  extractTags,
} from "@/lib/qloo/raw";
import {
  getPlaceInsights,
  mapSearchResponse,
  mapTagResponse,
  searchEntities,
  searchTags,
} from "@/lib/qloo/client";
import { mapRawEntity } from "@/lib/qloo/map";
import { mockPlacesForLocation, withMockSignals } from "@/data/mock-places";

export interface ResolvedSeeds {
  entities: TasteSeed[];
  tagIds: string[];
  calls: number;
  unresolved: TasteSeed[];
}

export async function resolveSeeds(seeds: TasteSeed[]): Promise<ResolvedSeeds> {
  if (isMockMode) {
    return {
      entities: seeds,
      tagIds: seeds.filter((seed) => seed.type === "cuisine").map((seed) => seed.qlooId),
      calls: 0,
      unresolved: [],
    };
  }

  const entities: TasteSeed[] = [];
  const tagIds: string[] = [];
  const unresolved: TasteSeed[] = [];

  await Promise.all(
    seeds.map(async (seed) => {
      try {
        if (seed.type === "cuisine") {
          const payload = await searchTags(seed.name);
          const tags = extractTags(payload);
          const best = tags.find((tag) => Boolean(tag.id));
          if (best?.id) tagIds.push(best.id);
          else if (seed.qlooId && !seed.qlooId.startsWith("mock:")) tagIds.push(seed.qlooId);
          else unresolved.push(seed);
          return;
        }

        const payload = await searchEntities(seed.name, seed.type);
        const results = extractSearchEntities(payload);
        const best = results.find((entity) => Boolean(entity.entity_id));
        if (best?.entity_id) {
          entities.push({
            ...seed,
            name: best.name ?? seed.name,
            qlooId: best.entity_id,
          });
        } else if (seed.qlooId && !seed.qlooId.startsWith("mock:")) {
          entities.push(seed);
        } else {
          unresolved.push(seed);
        }
      } catch {
        if (seed.qlooId && !seed.qlooId.startsWith("mock:")) {
          if (seed.type === "cuisine") tagIds.push(seed.qlooId);
          else entities.push(seed);
        } else {
          unresolved.push(seed);
        }
      }
    }),
  );

  return { entities, tagIds, calls: seeds.length, unresolved };
}

export interface CandidateResult {
  candidates: PlaceCandidate[];
  calls: number;
  degraded: string[];
}

export async function getPlaceCandidates(input: {
  seeds: TasteSeed[];
  tagIds: string[];
  location: string;
  limit: number;
}): Promise<CandidateResult> {
  if (isMockMode) {
    const places = mockPlacesForLocation(input.location);
    if (places.length === 0) {
      return { candidates: [], calls: 0, degraded: ["sample_location"] };
    }
    return {
      candidates: withMockSignals(places, input.seeds).slice(0, Math.max(input.limit * 2, 8)),
      calls: 0,
      degraded: [],
    };
  }

  try {
    const payload = await getPlaceInsights({
      entityIds: input.seeds.map((seed) => seed.qlooId),
      tagIds: input.tagIds,
      location: input.location,
      limit: Math.max(input.limit * 3, 12),
    });
    const candidates = extractInsightEntities(payload)
      .map((entity) => mapRawEntity(entity, input.seeds))
      .filter((candidate): candidate is PlaceCandidate => Boolean(candidate));
    return {
      candidates,
      calls: 1,
      degraded: candidates.length < 3 ? ["few_results"] : [],
    };
  } catch {
    return { candidates: [], calls: 1, degraded: ["qloo"] };
  }
}

export { mapSearchResponse, mapTagResponse };
