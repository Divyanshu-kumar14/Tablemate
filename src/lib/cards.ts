import type { Card, Needs, TasteSeed, WireCard } from "@/types/domain";
import type { RankedCandidate } from "@/lib/fit/apply-senior-fit";
import { buildBeforeYouGo } from "@/lib/fit/script";

export function templateTasteReason(
  candidate: RankedCandidate["candidate"],
  seeds: TasteSeed[],
  location: string,
): string {
  const names = seeds.slice(0, 2).map((seed) => seed.name);
  const cuisine = candidate.cuisine;
  const article = /^[aeiou]/i.test(cuisine) ? "An" : "A";

  if (names.length >= 2) {
    return `${article} ${cuisine} room in ${location} that fits a fan of ${names[0]} and ${names[1]}.`;
  }
  if (names.length === 1) {
    return `${article} ${cuisine} room in ${location} that fits a fan of ${names[0]}.`;
  }
  return `${article} ${cuisine} option in ${location} that fits the needs you selected.`;
}

export function toCard(options: {
  ranked: RankedCandidate;
  seeds: TasteSeed[];
  location: string;
  needs: Needs;
  revision: 0 | 1;
  tasteReason?: string;
}): Card {
  const { ranked, seeds, location, needs, revision, tasteReason } = options;
  const candidate = ranked.candidate;

  return {
    id: candidate.id,
    name: candidate.name,
    cuisine: candidate.cuisine,
    address: candidate.address,
    phone: candidate.phone,
    qlooEntityId: candidate.id,
    tasteReason: tasteReason ?? templateTasteReason(candidate, seeds, location),
    signals:
      candidate.signals.length > 0
        ? candidate.signals
        : [{ source: "qloo_insights", detail: "Affinity from your taste signals" }],
    fit: ranked.fit,
    beforeYouGo: buildBeforeYouGo(needs),
    score: ranked.score,
    revision,
    imageUrl: candidate.imageUrl,
    priceLevel: candidate.priceLevel,
    tags: candidate.tags,
  };
}

export function toWireCard(card: Card): WireCard {
  return {
    id: card.id,
    name: card.name,
    cuisine: card.cuisine,
    address: card.address,
    phone: card.phone,
    qloo_entity_id: card.qlooEntityId,
    taste_reason: card.tasteReason,
    signals: card.signals,
    fit: card.fit,
    before_you_go: card.beforeYouGo,
    score: card.score,
    revision: card.revision,
    image_url: card.imageUrl,
    price_level: card.priceLevel,
    tags: card.tags,
  };
}
