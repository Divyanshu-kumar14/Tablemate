"use client";

import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { WelcomeBeacon } from "@/components/ui/welcome-beacon";
import { Spotlight } from "@/components/ui/spotlight";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { TasteGraphBeam } from "@/components/taste-graph-beam";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 sm:pt-12 sm:pb-24">
      {/* Interactive mouse-tracking ambient spotlight */}
      <Spotlight className="z-0" />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[54rem] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl" />

      <div className="container-page relative z-10 text-center">
        <div className="mx-auto max-w-3xl">
          {/* Interactive Welcome Beacon */}
          <div className="mb-6">
            <WelcomeBeacon />
          </div>

          {/* Staggered Animated Headline */}
          <motion.div
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-amber-300 backdrop-blur-md mb-4">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Cultural Intelligence Meets Senior Care</span>
            </div>

            <h1 className="font-display text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[1.02] tracking-tight text-zinc-100">
              Good taste <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">doesn&apos;t</span> retire.
            </h1>
          </motion.div>

          {/* Subtitle with gentle spring reveal */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            className="mt-6 text-lg sm:text-xl leading-relaxed text-zinc-300"
          >
            A restaurant shortlist for an aging parent, shaped by the music and films they love, calibrated for texture, sodium, and mobility, and verified with a 30-second call script.
          </motion.p>

          {/* KokonutUI Floating Action Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            className="mt-8"
          >
            <ActionSearchBar />
          </motion.div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/plan" className="btn-primary">
              Build a Shortlist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="#personas" className="btn-secondary">
              Explore Demo Personas
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>No signup required · 1-tap live agent · Zero hallucinated health claims</span>
          </motion.div>
        </div>

        {/* Interactive Magic UI Animated Taste Graph Beam */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          className="mt-12 sm:mt-16"
        >
          <div className="mb-3 text-center">
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Interactive Engine Architecture · Sample preview
            </span>
          </div>
          <TasteGraphBeam />
        </motion.div>
      </div>
    </section>
  );
}
