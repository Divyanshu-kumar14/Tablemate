"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, MapPin, Phone, Sparkles, ShieldCheck } from "lucide-react";
import type { WireCard } from "@/types/domain";
import { EvidenceChip } from "@/components/evidence-chip";
import { CopyButton } from "@/components/copy-button";

export function RestaurantCard({ card, rank }: { card: WireCard; rank: number }) {
  const [open, setOpen] = useState(rank === 1);
  const isPreview = card.revision === 0;
  const hasFallback = card.signals.some((signal) => signal.source === "fallback");
  const phoneHref = card.phone ? `tel:${card.phone.replace(/[^\d+]/g, "")}` : null;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${card.name}, ${card.address}`,
  )}`;
  const scriptText = card.before_you_go.map((question, index) => `${index + 1}. ${question}`).join("\n");

  const matchPercent = Math.min(99, Math.max(75, Math.round(card.score * 100)));

  return (
    <article
      className="liquid-glass liquid-glass-specular overflow-hidden transition-all duration-300 hover:border-amber-400/30 hover:shadow-glass-glow"
      aria-labelledby={`card-title-${card.id}`}
      data-card-id={card.id}
      data-card-revision={card.revision}
    >
      {/* Top Banner */}
      <div className="border-b border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                {rank === 1 ? "Top Recommendation" : `Pick 0${rank}`}
              </span>
              {isPreview && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  Preview Stream
                </span>
              )}
            </div>

            <h2
              id={`card-title-${card.id}`}
              className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100"
            >
              {card.name}
            </h2>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              {card.cuisine}
              {card.price_level ? ` · ${card.price_level}` : ""}
            </p>
          </div>

          {/* Radial / Score Pill */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-3 py-1 text-xs font-mono font-semibold text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{matchPercent}% Match</span>
            </div>
            <span className="mt-1 font-mono text-[10px] text-zinc-500">Rank #0{rank}</span>
          </div>
        </div>

        {/* Natural Language Taste Reason */}
        <p className="mt-5 max-w-3xl border-l-2 border-amber-400/60 pl-4 font-display text-lg sm:text-xl leading-snug text-zinc-200">
          &ldquo;{card.taste_reason}&rdquo;
        </p>

        <p className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          {hasFallback ? "Sample taste match" : "Cross-domain affinity grounded by Qloo"}
          {isPreview && <span className="text-amber-400 animate-pulse">· polishing notes…</span>}
        </p>

        {/* Evidence Chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {card.fit.map((item) => (
            <EvidenceChip key={`${item.need}-${item.label}`} item={item} />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Interactive 30-Second Call Script Drawer */}
        <details
          className="liquid-glass group rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-obsidian-900 to-obsidian-950"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-[58px] items-center justify-between gap-4 px-4 py-3 sm:px-5 cursor-pointer">
            <span className="flex items-center gap-2.5 text-sm sm:text-base font-semibold text-amber-300">
              <Phone className="h-4 w-4 text-amber-400" aria-hidden="true" />
              Your 30-second call
            </span>
            <span className="flex items-center gap-2 font-mono text-xs text-zinc-400">
              {card.before_you_go.length} questions
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
            </span>
          </summary>

          <div className="border-t border-white/[0.08] px-4 pb-5 pt-4 sm:px-5">
            <p className="text-xs text-zinc-400 mb-3">
              Ask these targeted questions before booking to verify texture and sodium accommodations:
            </p>
            <ol className="space-y-2.5">
              {card.before_you_go.map((question, index) => (
                <li key={question} className="flex gap-3 text-sm leading-relaxed text-zinc-200">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 font-mono text-xs font-semibold text-amber-300">
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-3 pt-2">
              <CopyButton text={scriptText} />
              <span className="text-xs text-zinc-400">Read directly on the call with the restaurant manager.</span>
            </div>
          </div>
        </details>

        {/* Signals & Logistics Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Why this one / Qloo Signals */}
          <div>
            <h3 className="eyebrow">Auditable Signals</h3>
            {card.signals.length > 0 ? (
              <ul className="mt-2.5 space-y-1.5">
                {card.signals.map((signal, index) => (
                  <li
                    key={`${signal.source}-${index}`}
                    className="flex gap-2 text-xs leading-relaxed text-zinc-300"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden="true" />
                    <span>{signal.detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2.5 text-xs text-zinc-400">
                Ranked using cross-domain latent cultural affinity and evidence tags.
              </p>
            )}

            {card.tags.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {card.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag.id || tag.name}
                    className="chip !text-[10px] !py-0.5 !px-2 font-mono"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Location & Contact Logistics */}
          <div>
            <h3 className="eyebrow">Venue Contact</h3>
            <p className="mt-2.5 flex items-start gap-2 text-xs leading-relaxed text-zinc-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/80" aria-hidden="true" />
              <span>{card.address}</span>
            </p>
            <p className="mt-1.5 flex items-center gap-2 text-xs text-zinc-300">
              <Phone className="h-3.5 w-3.5 shrink-0 text-amber-400/80" aria-hidden="true" />
              <span>{card.phone ?? "Phone not listed in directory."}</span>
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {phoneHref ? (
                <a href={phoneHref} className="btn-secondary !min-h-[42px] !px-3.5 !text-xs font-semibold flex-1 sm:flex-initial justify-center">
                  <Phone className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                  Call Ahead
                </a>
              ) : (
                <span className="inline-flex min-h-[42px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 text-xs text-zinc-400 flex-1 sm:flex-initial">
                  Phone not listed
                </span>
              )}
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary !min-h-[42px] !px-3.5 !text-xs font-semibold flex-1 sm:flex-initial justify-center"
                aria-label={`Directions to ${card.name}`}
              >
                <ExternalLink className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>
        </div>

        {/* Label Explanation Details */}
        <details className="liquid-glass group rounded-xl border border-white/[0.08] p-4 text-xs">
          <summary className="flex items-center justify-between font-semibold text-zinc-300 cursor-pointer">
            <span>How we labeled this</span>
            <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>

          {card.fit.length > 0 && (
            <ul className="mt-3.5 space-y-3 border-t border-white/[0.06] pt-3">
              {card.fit.map((item) => (
                <li key={`why-${item.need}-${item.label}`} className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-200">{item.need}</span>
                    <span className="font-mono text-[10px] uppercase text-zinc-400">({item.label})</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-400">{item.why}</p>
                </li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </article>
  );
}
