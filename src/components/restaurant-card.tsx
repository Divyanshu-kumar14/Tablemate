"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, MapPin, Phone, Sparkles } from "lucide-react";
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

  return (
    <article
      className="card-paper animate-rise overflow-hidden"
      aria-labelledby={`card-title-${card.id}`}
      data-card-id={card.id}
      data-card-revision={card.revision}
    >
      <div className="border-b border-line/70 bg-gradient-to-br from-white via-paper to-cream/80 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="eyebrow">{rank === 1 ? "Top pick" : `Pick ${String(rank).padStart(2, "0")}`}</p>
              {isPreview && (
                <span className="rounded-full bg-amber-light px-2.5 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-[#92400E]">
                  Preview
                </span>
              )}
            </div>
            <h2
              id={`card-title-${card.id}`}
              className="mt-2 font-display text-[2rem] font-semibold leading-tight sm:text-[2.5rem]"
            >
              {card.name}
            </h2>
            <p className="mt-1 text-[1rem] text-muted">
              {card.cuisine}
              {card.price_level ? ` · ${card.price_level}` : ""}
            </p>
          </div>
          <span
            className="hidden font-display text-[2.8rem] leading-none text-teal/70 sm:block"
            aria-hidden="true"
          >
            {String(rank).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-5 max-w-3xl font-display text-[1.3rem] leading-snug">
          &ldquo;{card.taste_reason}&rdquo;
        </p>
        <p className="mt-2 inline-flex flex-wrap items-center gap-1.5 text-[0.85rem] text-muted">
          <Sparkles className="h-4 w-4 text-teal/70" aria-hidden="true" />
          {hasFallback ? "Sample taste link" : "Taste link from Qloo"}
          {isPreview && <span className="text-amber">· refining the note…</span>}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {card.fit.map((item) => (
            <EvidenceChip key={`${item.need}-${item.label}`} item={item} />
          ))}
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <details
          className="group rounded-xl border border-teal/20 bg-teal-light/35"
          open={open}
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary className="flex min-h-[64px] items-center justify-between gap-4 px-4 py-3 sm:px-5">
            <span className="flex items-center gap-2 text-[1.05rem] font-semibold text-teal-dark">
              <Phone className="h-5 w-5" aria-hidden="true" />
              Your 30-second call
            </span>
            <span className="flex items-center gap-2 text-[0.9rem] font-semibold text-teal-dark">
              {card.before_you_go.length} questions
              <ChevronDown
                className="h-5 w-5 transition group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </summary>

          <div className="border-t border-teal/15 px-4 pb-5 pt-4 sm:px-5">
            <ol className="space-y-3">
              {card.before_you_go.map((question, index) => (
                <li key={question} className="flex gap-3 text-[1rem] leading-relaxed">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[0.9rem] font-semibold text-teal-dark ring-1 ring-teal/20">
                    {index + 1}
                  </span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <CopyButton text={scriptText} />
              <span className="text-[0.9rem] text-muted">
                Read it on the phone. Write down what they say.
              </span>
            </div>
          </div>
        </details>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-teal">
              Why this one
            </h3>
            {card.signals.length > 0 ? (
              <ul className="mt-3 space-y-2">
                {card.signals.map((signal, index) => (
                  <li
                    key={`${signal.source}-${index}`}
                    className="flex gap-2 text-[0.95rem] leading-relaxed"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/50"
                      aria-hidden="true"
                    />
                    <span>{signal.detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[0.95rem] text-muted">
                Ranked on taste affinity and the needs you selected.
              </p>
            )}

            {card.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {card.tags.slice(0, 8).map((tag) => (
                  <span
                    key={tag.id || tag.name}
                    className="rounded-full bg-cream px-2.5 py-1 text-[0.85rem] text-muted ring-1 ring-line"
                  >
                    {tag.name}
                  </span>
                ))}
                {card.tags.length > 8 && (
                  <span className="rounded-full bg-cream px-2.5 py-1 text-[0.85rem] text-muted ring-1 ring-line">
                    +{card.tags.length - 8}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-teal">
              Find it
            </h3>
            <p className="mt-3 flex gap-2 text-[0.95rem] leading-relaxed">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal/70" aria-hidden="true" />
              <span>{card.address}</span>
            </p>
            <p className="mt-2 flex gap-2 text-[0.95rem] leading-relaxed">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-teal/70" aria-hidden="true" />
              <span>{card.phone ?? "Phone not listed in this data."}</span>
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {phoneHref ? (
                <a href={phoneHref} className="btn-secondary !min-h-[48px] !px-4 !text-[0.95rem]">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call
                </a>
              ) : (
                <span className="inline-flex min-h-[48px] items-center rounded-xl border border-line bg-cream px-4 text-[0.95rem] text-muted">
                  Phone not listed
                </span>
              )}
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary !min-h-[48px] !px-4 !text-[0.95rem]"
                aria-label={`Directions to ${card.name}`}
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Directions
              </a>
            </div>
          </div>
        </div>

        <details className="group mt-6 rounded-xl border border-line bg-cream/45 p-4">
          <summary className="flex min-h-[48px] items-center justify-between gap-3 text-[0.95rem] font-semibold text-ink">
            How we labeled this
            <ChevronDown
              className="h-5 w-5 text-muted transition group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          {card.fit.length > 0 ? (
            <ul className="mt-3 space-y-4">
              {card.fit.map((item) => (
                <li key={`why-${item.need}-${item.label}`}>
                  <EvidenceChip item={item} />
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{item.why}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.95rem] text-muted">
              No extra needs were selected, so this card is ranked on taste alone.
            </p>
          )}

          <p className="mt-4 border-t border-line/70 pt-3 text-[0.9rem] leading-relaxed text-muted">
            Reported means a source states it. Likely means we inferred it from cuisine patterns
            or venue tags. Ask means the data does not answer the question. These are evidence
            labels, not safety ratings.
          </p>
        </details>
      </div>
    </article>
  );
}
