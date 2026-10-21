export interface RawTag {
  id?: string;
  name?: string;
  type?: string;
}

export interface RawEntity {
  name?: string;
  entity_id?: string;
  type?: string;
  subtype?: string;
  properties?: Record<string, unknown>;
  tags?: RawTag[];
  popularity?: number;
  affinity?: number;
  query?: {
    explainability?: unknown;
    measurements?: Record<string, unknown>;
  };
}

export interface RawSearchResponse {
  success?: boolean;
  duration?: number;
  results?: RawEntity[] | { entities?: RawEntity[] };
}

export interface RawTagResponse {
  success?: boolean;
  duration?: number;
  results?: { tags?: RawTag[] } | RawTag[];
}

export interface RawInsightsResponse {
  success?: boolean;
  duration?: number;
  results?: { entities?: RawEntity[]; duration?: number };
  query?: { explainability?: unknown; locality?: unknown };
}

export function extractSearchEntities(payload: RawSearchResponse): RawEntity[] {
  if (Array.isArray(payload.results)) return payload.results;
  if (payload.results && Array.isArray(payload.results.entities)) return payload.results.entities;
  return [];
}

export function extractInsightEntities(payload: RawInsightsResponse): RawEntity[] {
  return payload.results?.entities ?? [];
}

export function extractTags(payload: RawTagResponse): RawTag[] {
  if (Array.isArray(payload.results)) return payload.results;
  return payload.results?.tags ?? [];
}
