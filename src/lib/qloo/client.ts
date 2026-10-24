 import { env, qlooBaseUrl } from "@/lib/env";
import type { SearchResult } from "@/data/mock-catalog";
import type { SeedType } from "@/types/domain";
import {
  extractSearchEntities,
  extractTags,
  type RawInsightsResponse,
  type RawSearchResponse,
  type RawTagResponse,
} from "@/lib/qloo/raw";

type ParamValue = string | number | boolean | string[] | undefined;

export type QlooErrorCode =
  | "unconfigured"
  | "unauthorized"
  | "rate_limited"
  | "bad_request"
  | "timeout"
  | "upstream_unavailable";

export class QlooError extends Error {
  readonly code: QlooErrorCode;
  readonly status: number;

  constructor(code: QlooErrorCode, status: number) {
    super(`Qloo request failed: ${code}`);
    this.name = "QlooError";
    this.code = code;
    this.status = status;
  }
}

const SEARCH_TYPE_URN: Partial<Record<SeedType, string>> = {
  artist: "urn:entity:artist",
  movie: "urn:entity:movie",
  tv: "urn:entity:tv_show",
  restaurant: "urn:entity:place",
};

function buildUrl(path: string, params: Record<string, ParamValue>): URL {
  const url = new URL(path, qlooBaseUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, Array.isArray(value) ? value.join(",") : String(value));
  }
  return url;
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

function statusToCode(status: number): QlooErrorCode {
  if (status === 400) return "bad_request";
  if (status === 401 || status === 403) return "unauthorized";
  if (status === 429) return "rate_limited";
  return "upstream_unavailable";
}

async function requestOnce(
  path: string,
  params: Record<string, ParamValue>,
  timeoutMs: number,
): Promise<Response> {
  if (!env.QLOO_API_KEY) throw new QlooError("unconfigured", 0);
  return fetch(buildUrl(path, params), {
    headers: {
      "X-Api-Key": env.QLOO_API_KEY,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
}

export async function qlooRequest<T>(
  path: string,
  params: Record<string, ParamValue>,
  timeoutMs = 4_000,
): Promise<T> {
  let lastError: QlooError | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await requestOnce(path, params, timeoutMs);
      if (response.status >= 500 && attempt === 0) {
        lastError = new QlooError("upstream_unavailable", response.status);
        continue;
      }
      if (!response.ok) {
        throw new QlooError(statusToCode(response.status), response.status);
      }
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof QlooError) {
        if (error.code === "timeout" && attempt === 0) {
          lastError = error;
          continue;
        }
        throw error;
      }
      if (isTimeout(error) && attempt === 0) {
        lastError = new QlooError("timeout", 0);
        continue;
      }
      if (isTimeout(error)) throw new QlooError("timeout", 0);
      throw new QlooError("upstream_unavailable", 0);
    }
  }

  throw lastError ?? new QlooError("upstream_unavailable", 0);
}

export function mapSearchResponse(
  payload: RawSearchResponse,
  requestedType?: SeedType,
): SearchResult[] {
  return extractSearchEntities(payload)
    .map((entity) => {
      const name = typeof entity.name === "string" ? entity.name : null;
      const id = typeof entity.entity_id === "string" ? entity.entity_id : null;
      if (!name || !id) return null;
      const subtype = entity.subtype ?? "";
      const type: SeedType =
        requestedType ??
        (subtype.includes("artist")
          ? "artist"
          : subtype.includes("movie")
            ? "movie"
            : subtype.includes("tv_show")
              ? "tv"
              : subtype.includes("place")
                ? "restaurant"
                : "restaurant");
      return { name, type, qlooId: id, subtitle: "From Qloo" };
    })
    .filter((result): result is SearchResult => Boolean(result))
    .slice(0, 8);
}

export function mapTagResponse(payload: RawTagResponse): SearchResult[] {
  return extractTags(payload)
    .map((tag): SearchResult | null => {
      if (!tag.id || !tag.name) return null;
      return { name: tag.name, type: "cuisine", qlooId: tag.id, subtitle: "Cuisine" };
    })
    .filter((result): result is SearchResult => Boolean(result))
    .slice(0, 8);
}

export async function searchEntities(
  query: string,
  type?: SeedType,
): Promise<RawSearchResponse> {
  const types = type ? SEARCH_TYPE_URN[type] : undefined;
  return qlooRequest<RawSearchResponse>("/search", {
    query,
    types,
    take: 8,
    sort_by: "match",
  });
}

export async function searchTags(query: string): Promise<RawTagResponse> {
  return qlooRequest<RawTagResponse>("/v2/tags", {
    "filter.query": query,
    "filter.tag.types": "urn:tag:genre:place,urn:tag:category:place",
    take: 8,
  });
}

/**
 * Restaurant / dining category tag URNs used to scope Qloo insights to
 * actual dining venues.  Without these, the API may return nightlife,
 * comedy clubs, or other "place" entities that lack a full kitchen.
 */
const DINING_CATEGORY_TAG_URNS = [
  "urn:tag:category:place:restaurant",
  "urn:tag:category:place:dining",
  "urn:tag:category:place:cafe",
  "urn:tag:category:place:bakery",
  "urn:tag:category:place:deli",
];

export async function getPlaceInsights(input: {
  entityIds: string[];
  tagIds: string[];
  location: string;
  limit: number;
}): Promise<RawInsightsResponse> {
  const params: Record<string, ParamValue> = {
    "filter.type": "urn:entity:place",
    "filter.location.query": input.location,
    "filter.tags": DINING_CATEGORY_TAG_URNS,
    take: Math.min(50, Math.max(1, input.limit)),
    "feature.explainability": true,
    sort_by: "affinity",
  };
  if (input.entityIds.length > 0) params["signal.interests.entities"] = input.entityIds;
  if (input.tagIds.length > 0) params["signal.interests.tags"] = input.tagIds;
  return qlooRequest<RawInsightsResponse>("/v2/insights", params, 5_000);
}
