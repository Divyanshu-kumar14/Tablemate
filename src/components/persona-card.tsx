"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Persona } from "@/data/personas";
import { needsSummary } from "@/lib/labels";

export function PersonaCard({ persona, index }: { persona: Persona; index: number }) {
  const needs = needsSummary(persona.needs);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="h-full"
    >
      <Link
        href={`/results?persona=${persona.id}`}
        className="liquid-glass liquid-glass-specular group flex h-full flex-col p-6 sm:p-7 text-left transition-all duration-300 hover:border-amber-400/40 hover:shadow-glass-glow"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-amber-400 uppercase">
            <MapPin className="h-3 w-3" /> {persona.location}
          </span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] font-mono text-xs font-bold text-zinc-300">
            0{index + 1}
          </span>
        </div>

        <div className="mt-5">
          <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
            {persona.name}, {persona.age}
          </h3>
          <p className="mt-1 text-xs font-semibold text-amber-400/90">{persona.relationship}</p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 line-clamp-3">{persona.blurb}</p>
        </div>

        {/* Taste Seeds preview */}
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Cultural Tastes</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {persona.taste.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-zinc-300"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Needs Tags */}
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Dining Accommodations</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {needs.slice(0, 4).map((need) => (
              <span
                key={need}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-950/40 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
              >
                <Heart className="h-2.5 w-2.5 text-emerald-400" />
                {need}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/[0.06]">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:text-amber-300">
            Launch {persona.name}&apos;s shortlist
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="font-mono text-[10px] text-zinc-500">1-Tap Live Agent</span>
        </div>
      </Link>
    </motion.div>
  );
}
