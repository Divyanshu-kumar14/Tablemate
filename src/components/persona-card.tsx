"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";
import { motion } from "motion/react";
import type { Persona } from "@/data/personas";
import { needsSummary } from "@/lib/labels";
import { BorderBeam } from "@/components/ui/border-beam";

export function PersonaCard({ persona, index }: { persona: Persona; index: number }) {
  const needs = needsSummary(persona.needs);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full relative flex flex-col"
    >
      <Link
        href={`/results?persona=${persona.id}`}
        className="liquid-glass liquid-glass-specular group relative flex h-full flex-col p-5 sm:p-6 text-left transition-all duration-200 hover:border-amber-400/40 hover:shadow-glass-glow"
      >
        {/* Subtle border beam highlight on top persona */}
        {index === 0 && (
          <BorderBeam size={160} duration={10} delay={0} colorFrom="#fbbf24" colorTo="#d97706" />
        )}

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-amber-400 uppercase">
            <MapPin className="h-2.5 w-2.5" /> {persona.location}
          </span>
          <span className="font-mono text-[11px] font-semibold text-zinc-400">
            Profile 0{index + 1}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
            {persona.name}, {persona.age}
          </h3>
          <p className="text-xs font-medium text-amber-400/90 mt-0.5">{persona.relationship}</p>
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">{persona.blurb}</p>
        </div>

        {/* Cultural Tastes */}
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Cultural Tastes</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {persona.taste.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-zinc-300 group-hover:border-amber-500/20 transition-colors"
              >
                <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                {t.name}
              </span>
            ))}
          </div>
        </div>

        {/* Accommodations */}
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Dining Accommodations</p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {needs.slice(0, 3).map((need) => (
              <span
                key={need}
                className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-950/30 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
              >
                <Heart className="h-2.5 w-2.5 text-emerald-400" />
                {need}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/[0.06]">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:text-amber-300">
            See {persona.name}&apos;s shortlist
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="font-mono text-[10px] text-zinc-400">1-Tap Live Agent</span>
        </div>
      </Link>
    </motion.div>
  );
}
