import type { Diet, Evidence, Mobility, Needs, Noise, SeedType, Sodium, Texture } from "@/types/domain";

export const TEXTURE_LABEL: Record<Texture, string> = {
  regular: "Regular texture",
  soft: "Soft texture",
  "very-soft": "Very soft / puréed",
};

export const SODIUM_LABEL: Record<Sodium, string> = {
  "no-preference": "No sodium preference",
  lower: "Lower sodium",
};

export const NOISE_LABEL: Record<Noise, string> = {
  quiet: "Quiet room",
  moderate: "Moderate noise",
  lively: "Lively room",
};

export const DIET_LABEL: Record<Diet, string> = {
  "diabetic-friendly": "Diabetic-friendly",
  "renal-friendly": "Renal-friendly",
  "gluten-free": "Gluten-free",
};

export const MOBILITY_LABEL: Record<Mobility, string> = {
  "step-free": "Step-free entrance",
  wheelchair: "Wheelchair access",
  "hearing-friendly": "Hearing-friendly",
  "low-vision-friendly": "Low-vision friendly",
};

export const EVIDENCE_COPY: Record<
  Evidence,
  { label: string; short: string; description: string }
> = {
  reported: {
    label: "Reported",
    short: "A source states it",
    description:
      "A source states this directly. It can still change, so confirm before you go.",
  },
  likely: {
    label: "Likely",
    short: "Inferred, confirm it",
    description:
      "Inferred from cuisine patterns or venue tags. It is a reasonable guess, not a promise.",
  },
  ask: {
    label: "Ask",
    short: "Not in our data",
    description:
      "We do not have this information. The call script gives you the exact question to ask.",
  },
};

export const SEED_TYPE_LABEL: Record<SeedType, string> = {
  artist: "Artist",
  movie: "Film",
  tv: "TV",
  restaurant: "Restaurant",
  cuisine: "Cuisine",
};

export function needsSummary(needs: Needs): string[] {
  const summary: string[] = [];
  if (needs.texture !== "regular") summary.push(TEXTURE_LABEL[needs.texture]);
  if (needs.sodium === "lower") summary.push(SODIUM_LABEL.lower);
  for (const diet of needs.diet) summary.push(DIET_LABEL[diet]);
  if (needs.noise) summary.push(NOISE_LABEL[needs.noise]);
  for (const mobility of needs.mobility) summary.push(MOBILITY_LABEL[mobility]);
  return summary;
}
