import type { Diet, Evidence, FitItem, Needs, PlaceCandidate } from "@/types/domain";
import { getCuisineRule } from "@/lib/fit/schema";

export interface RankedCandidate {
  candidate: PlaceCandidate;
  fit: FitItem[];
  score: number;
}

interface FitAddition {
  category: "texture" | "sodium" | "diet" | "noise" | "mobility";
  item: FitItem;
}

const EVIDENCE_VALUE: Record<Evidence, number> = {
  reported: 1,
  likely: 0.7,
  ask: 0.3,
};

const WEIGHTS: Record<FitAddition["category"], number> = {
  texture: 0.3,
  sodium: 0.15,
  diet: 0.2,
  noise: 0.15,
  mobility: 0.1,
};

const DIET_LABEL: Record<Diet, string> = {
  "diabetic-friendly": "Diabetic-friendly",
  "renal-friendly": "Renal-friendly",
  "gluten-free": "Gluten-free",
};

function tagText(candidate: PlaceCandidate): string {
  return candidate.tags.map((tag) => `${tag.name} ${tag.id}`).join(" ").toLowerCase();
}

function hasTag(candidate: PlaceCandidate, pattern: RegExp): boolean {
  return pattern.test(tagText(candidate));
}

function wheelchairPositive(candidate: PlaceCandidate): boolean {
  return hasTag(candidate, /wheelchair|accessible entrance|accessible restroom|disabled access/);
}

function stepFreePositive(candidate: PlaceCandidate): boolean {
  return hasTag(
    candidate,
    /step.?free|no steps|ramp|elevator|wheelchair|accessible entrance/,
  );
}

function accessibilityNegative(candidate: PlaceCandidate): boolean {
  return hasTag(
    candidate,
    /not\s+wheelchair|no\s+wheelchair|stairs only|not\s+accessible|no\s+elevator|no\s+ramp/,
  );
}

function quietTag(candidate: PlaceCandidate): boolean {
  return hasTag(candidate, /quiet|intimate|calm|low noise|library/);
}

function livelyTag(candidate: PlaceCandidate): boolean {
  return hasTag(candidate, /lively|noisy|bustling|music/);
}

function hearingTag(candidate: PlaceCandidate): boolean {
  return hasTag(candidate, /hearing loop|hearing friendly|hearing-friendly/);
}

function lowVisionTag(candidate: PlaceCandidate): boolean {
  return hasTag(candidate, /large print|low vision|low-vision|braille/);
}

export function evaluateCandidate(
  candidate: PlaceCandidate,
  needs: Needs,
): { fit: FitItem[]; score: number; excluded: boolean } {
  const rule = getCuisineRule(candidate.cuisine);
  const additions: FitAddition[] = [];
  let excluded = false;

  const add = (category: FitAddition["category"], need: string, label: Evidence, why: string) => {
    additions.push({ category, item: { need, label, why } });
  };

  if (needs.texture === "soft") {
    if (rule) add("texture", "Soft texture", "likely", rule.texture.why);
    else add("texture", "Soft texture", "ask", "Texture is not published in the data we have.");
  }
  if (needs.texture === "very-soft") {
    add(
      "texture",
      "Very soft / puréed texture",
      "ask",
      "Puréed and texture-modified food is a medical texture level; cuisine-level inference is not enough.",
    );
  }

  if (needs.sodium === "lower") {
    if (rule) add("sodium", "Lower sodium", "likely", rule.sodium.why);
    else add("sodium", "Lower sodium", "ask", "Sodium is not published in the data we have.");
  }

  for (const diet of needs.diet) {
    const note = rule?.diet[diet];
    if (note) add("diet", DIET_LABEL[diet], "likely", note.why);
    else add("diet", DIET_LABEL[diet], "ask", "Not enough data to infer this from cuisine.");
  }

  if (needs.noise === "quiet") {
    if (quietTag(candidate)) {
      add("noise", "Quiet room", "reported", "Qloo place tags describe a quiet or intimate room.");
    } else if (livelyTag(candidate)) {
      add("noise", "Quiet room", "ask", "Qloo tags suggest a livelier room; ask for a quieter table.");
    } else {
      add("noise", "Quiet room", "ask", "Noise level is not published in the data we have.");
    }
  } else if (needs.noise === "lively") {
    if (livelyTag(candidate)) {
      add("noise", "Lively room", "reported", "Qloo place tags describe a lively room.");
    } else {
      add("noise", "Lively room", "ask", "Noise level is not published in the data we have.");
    }
  } else if (needs.noise === "moderate") {
    add("noise", "Moderate noise", "ask", "Moderate noise is not directly reported; ask about the room.");
  }

  for (const mobility of needs.mobility) {
    const negative = accessibilityNegative(candidate);

    if (negative && (mobility === "wheelchair" || mobility === "step-free")) {
      excluded = true;
      continue;
    }

    if (mobility === "wheelchair") {
      const positive = wheelchairPositive(candidate);
      add(
        "mobility",
        "Wheelchair access",
        positive ? "reported" : "ask",
        positive
          ? "Qloo place tags mention wheelchair access."
          : "Wheelchair access is not published in the data we have.",
      );
    } else if (mobility === "step-free") {
      const positive = stepFreePositive(candidate);
      add(
        "mobility",
        "Step-free entrance",
        positive ? "reported" : "ask",
        positive
          ? "Qloo place tags mention step-free access."
          : "Step-free access is not published in the data we have.",
      );
    } else if (mobility === "hearing-friendly") {
      add(
        "mobility",
        "Hearing-friendly",
        hearingTag(candidate) ? "reported" : "ask",
        hearingTag(candidate)
          ? "Qloo place tags mention hearing support."
          : "Hearing support is not published in the data we have.",
      );
    } else {
      add(
        "mobility",
        "Low-vision friendly",
        lowVisionTag(candidate) ? "reported" : "ask",
        lowVisionTag(candidate)
          ? "Qloo place tags mention low-vision support."
          : "Low-vision support is not published in the data we have.",
      );
    }
  }

  let weighted = 0;
  let totalWeight = 0;
  for (const addition of additions) {
    const weight = WEIGHTS[addition.category];
    weighted += weight * EVIDENCE_VALUE[addition.item.label];
    totalWeight += weight;
  }

  const signalScore = candidate.affinity ?? 0.5;
  const fitScore = totalWeight > 0 ? weighted / totalWeight : 0;
  const score =
    totalWeight > 0
      ? Number((0.55 * signalScore + 0.45 * fitScore).toFixed(3))
      : Number(signalScore.toFixed(3));

  return {
    fit: additions.map((addition) => addition.item),
    score: Math.max(0, Math.min(1, score)),
    excluded,
  };
}

export function applySeniorFit(
  candidates: PlaceCandidate[],
  needs: Needs,
  limit = 5,
): RankedCandidate[] {
  return candidates
    .map((candidate) => {
      const evaluated = evaluateCandidate(candidate, needs);
      return {
        candidate,
        fit: evaluated.fit,
        score: evaluated.score,
        excluded: evaluated.excluded,
      };
    })
    .filter((entry) => !entry.excluded)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ excluded: _excluded, ...entry }) => entry);
}
