export type Texture = "regular" | "soft" | "very-soft";
export type Sodium = "no-preference" | "lower";
export type Noise = "quiet" | "moderate" | "lively";
export type Diet = "diabetic-friendly" | "renal-friendly" | "gluten-free";
export type Mobility =
  | "step-free"
  | "wheelchair"
  | "hearing-friendly"
  | "low-vision-friendly";
export type Evidence = "reported" | "likely" | "ask";
export type SeedType = "artist" | "movie" | "tv" | "restaurant" | "cuisine";

export interface TasteSeed {
  name: string;
  type: SeedType;
  qlooId: string;
}

export interface Needs {
  texture: Texture;
  sodium: Sodium;
  diet: Diet[];
  noise?: Noise;
  mobility: Mobility[];
  note?: string;
}

export interface FitItem {
  need: string;
  label: Evidence;
  why: string;
}

export interface QlooSignal {
  source: "qloo_insights" | "qloo_tags" | "qloo_entity" | "fallback";
  detail: string;
}

export interface TagRef {
  id: string;
  name: string;
  type: string;
}

export interface PlaceCandidate {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string | null;
  priceLevel: string | null;
  imageUrl: string | null;
  tags: TagRef[];
  popularity: number;
  affinity: number | null;
  explainability: unknown;
  signals: QlooSignal[];
}

export interface Card {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string | null;
  qlooEntityId: string;
  tasteReason: string;
  signals: QlooSignal[];
  fit: FitItem[];
  beforeYouGo: string[];
  score: number;
  revision: 0 | 1;
  imageUrl: string | null;
  priceLevel: string | null;
  tags: TagRef[];
}

/** Wire format: snake_case, matching the PRD API examples. */
export interface WireCard {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  phone: string | null;
  qloo_entity_id: string;
  taste_reason: string;
  signals: QlooSignal[];
  fit: FitItem[];
  before_you_go: string[];
  score: number;
  revision: 0 | 1;
  image_url: string | null;
  price_level: string | null;
  tags: TagRef[];
}

export type StreamEvent =
  | {
      event: "step";
      data: { step: string; status: "running" | "done" | "error"; detail?: string; ms?: number };
    }
  | { event: "card"; data: WireCard }
  | {
      event: "done";
      data: {
        count: number;
        ms: number;
        degraded: string[];
        request_id: string;
        mode: "live" | "mock";
        qloo_calls: number;
        llm_used: boolean;
      };
    }
  | { event: "error"; data: { code: string; message: string; retry_after?: number | null } };
