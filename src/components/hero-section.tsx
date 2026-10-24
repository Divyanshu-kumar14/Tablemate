"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { TasteGraphBeam } from "@/components/taste-graph-beam";
import { LivingShader } from "@/components/ui/living-shader";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:pt-14 sm:pb-20 border-b border-white/[0.06]">
      {/* React Bits Living WebGL Iridescent Shader Canvas */}
      <LivingShader className="opacity-50 z-0" speed={0.0006} />

      {/* Ambient background aura */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[36rem] w-[54rem] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl" />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        {/* Sleek Badge Pill */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-medium text-amber-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Cultural Dining Intelligence for Aging Parents</span>
        </motion.div>

        {/* Clean, Tight, Modern Headline */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="w-full max-w-4xl"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.08] mx-auto">
            <span className="text-gradient-sweep">
              Good taste doesn&apos;t retire.
            </span>
          </h1>
        </motion.div>

        {/* Concise Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-3.5 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto"
        >
          A restaurant shortlist shaped by the music and films they cherish — calibrated for texture, sodium, and mobility, supported with an exact 30-second call script.
        </motion.p>

        {/* KokonutUI Floating Action Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-6 w-full max-w-xl mx-auto"
        >
          <ActionSearchBar />
        </motion.div>

        {/* Clean Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-3 w-full"
        >
          <Link
            href="/results?persona=p1"
            className="btn-primary !min-h-[42px] !px-5 !text-xs sm:!text-sm font-semibold"
          >
            Launch Sylvia&apos;s Shortlist (1-Tap)
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/plan"
            className="btn-secondary !min-h-[42px] !px-5 !text-xs sm:!text-sm font-semibold"
          >
            Build Custom Profile
          </Link>
        </motion.div>

        {/* Muted Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono"
        >
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>No account required</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Qloo 250M+ Cultural Entities</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero hallucinated health claims</span>
          </span>
        </motion.div>

        {/* Interactive Magic UI Taste Graph Beam */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="mt-8 sm:mt-10 w-full"
        >
          <div className="mb-2 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Interactive Latent Graph Simulation · Sample preview
            </span>
          </div>
          <TasteGraphBeam />
        </motion.div>
      </div>
    </section>
  );
}
