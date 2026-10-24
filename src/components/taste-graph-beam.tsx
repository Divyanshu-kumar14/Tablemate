"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Music, Film, UtensilsCrossed, Sparkles, ShieldCheck, HeartHandshake, PhoneCall } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/cn";

export function TasteGraphBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const movieRef = useRef<HTMLDivElement>(null);
  const cuisineRef = useRef<HTMLDivElement>(null);
  const qlooCoreRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const [activeSignal, setActiveSignal] = useState<string | null>(null);

  return (
    <div className="relative mx-auto w-full max-w-4xl py-6">
      {/* Background radial highlight */}
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent blur-2xl" />

      {/* Main glass visual container */}
      <div
        ref={containerRef}
        className="liquid-glass liquid-glass-specular relative flex flex-col items-center justify-between gap-8 p-6 sm:flex-row sm:gap-4 sm:p-10"
      >
        {/* Animated Beams connecting Inputs -> Qloo Core */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={musicRef}
          toRef={qlooCoreRef}
          duration={3.2}
          curvature={-25}
          gradientStartColor="#fbbf24"
          gradientStopColor="#d97706"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={movieRef}
          toRef={qlooCoreRef}
          duration={3.8}
          delay={0.6}
          curvature={0}
          gradientStartColor="#f59e0b"
          gradientStopColor="#b45309"
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={cuisineRef}
          toRef={qlooCoreRef}
          duration={3.5}
          delay={1.2}
          curvature={25}
          gradientStartColor="#fbbf24"
          gradientStopColor="#d97706"
        />

        {/* Animated Beam connecting Qloo Core -> Restaurant Match */}
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={qlooCoreRef}
          toRef={outputRef}
          duration={3}
          delay={0.3}
          curvature={0}
          pathWidth={2.5}
          gradientStartColor="#10b981"
          gradientStopColor="#fbbf24"
        />

        {/* Left: 3 Taste Input Capsules */}
        <div className="flex flex-col gap-3.5 z-10 w-full sm:w-auto">
          <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400/70 sm:hidden">
            Cultural Taste Seeds
          </span>

          {/* Seed 1: Music */}
          <motion.div
            ref={musicRef}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setActiveSignal("Miles Davis")}
            onHoverEnd={() => setActiveSignal(null)}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-white/[0.08] bg-obsidian-850/80 px-4 py-2.5 backdrop-blur-md transition-all cursor-pointer",
              activeSignal === "Miles Davis" && "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Music className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-100">Miles Davis</p>
              <p className="text-[10px] text-zinc-400 font-mono">Artist · Cool Jazz</p>
            </div>
          </motion.div>

          {/* Seed 2: Movie */}
          <motion.div
            ref={movieRef}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setActiveSignal("Casablanca")}
            onHoverEnd={() => setActiveSignal(null)}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-white/[0.08] bg-obsidian-850/80 px-4 py-2.5 backdrop-blur-md transition-all cursor-pointer",
              activeSignal === "Casablanca" && "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-100">Casablanca</p>
              <p className="text-[10px] text-zinc-400 font-mono">Cinema · Classic</p>
            </div>
          </motion.div>

          {/* Seed 3: Cuisine */}
          <motion.div
            ref={cuisineRef}
            whileHover={{ scale: 1.03 }}
            onHoverStart={() => setActiveSignal("Italian")}
            onHoverEnd={() => setActiveSignal(null)}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-white/[0.08] bg-obsidian-850/80 px-4 py-2.5 backdrop-blur-md transition-all cursor-pointer",
              activeSignal === "Italian" && "border-amber-400/50 shadow-[0_0_20px_rgba(245,158,11,0.25)]",
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <UtensilsCrossed className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-100">Classic Italian</p>
              <p className="text-[10px] text-zinc-400 font-mono">Cuisine · Soft polenta</p>
            </div>
          </motion.div>
        </div>

        {/* Center: Glowing Qloo Cultural Graph Core */}
        <div ref={qlooCoreRef} className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-obsidian-900 to-obsidian-950 p-1 shadow-[0_0_35px_rgba(245,158,11,0.25)]">
            {/* Spinning decorative orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-[spin_20s_linear_infinite]" />
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-obsidian-900/90 text-center">
              <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              <span className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider text-amber-300">
                Qloo Core
              </span>
              <span className="font-mono text-[8px] text-zinc-500">250M+ Taste Graph</span>
            </div>
          </div>
        </div>

        {/* Right: Output Curated Dining Room Node */}
        <motion.div
          ref={outputRef}
          whileHover={{ scale: 1.02 }}
          className="z-10 w-full sm:w-72 rounded-xl border border-emerald-500/30 bg-obsidian-850/90 p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> 98% Taste Fit
            </span>
            <span className="font-mono text-[10px] text-zinc-400">Brooklyn, NY</span>
          </div>

          <div className="mt-2.5">
            <h4 className="text-sm font-semibold text-zinc-100">Cobble Hill Trattoria</h4>
            <p className="mt-1 text-xs text-zinc-300 line-clamp-2">
              Intimate, quiet Italian room with soft risotto and step-free access.
            </p>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-2 text-[10px] text-amber-400/90 font-mono">
            <span className="flex items-center gap-1">
              <HeartHandshake className="h-3 w-3" /> Soft texture likely
            </span>
            <span className="flex items-center gap-1 text-zinc-400">
              <PhoneCall className="h-3 w-3" /> 30s call ready
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
