"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { WelcomeBeacon } from "@/components/ui/welcome-beacon";
import { Spotlight } from "@/components/ui/spotlight";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { TasteGraphBeam } from "@/components/taste-graph-beam";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14">
      {/* Interactive mouse-tracking ambient spotlight */}
      <Spotlight className="z-0" />

      {/* Smooth ambient background aura covering hero & beam */}
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[42rem] w-[64rem] rounded-full bg-gradient-to-b from-amber-500/12 via-amber-600/6 to-transparent blur-3xl" />

      <div className="container-page relative z-10 flex flex-col items-center text-center">
        {/* Interactive Welcome Beacon */}
        <div className="mb-3 sm:mb-4">
          <WelcomeBeacon />
        </div>

        {/* Staggered Animated Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="w-full max-w-3xl"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.08] mx-auto">
            Good taste <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">doesn&apos;t</span> retire.
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="mt-2.5 text-base sm:text-lg leading-relaxed text-zinc-300 max-w-xl mx-auto"
        >
          A restaurant shortlist for an aging parent, shaped by the music and films they love, calibrated for texture, sodium, and mobility, and verified with a 30-second call script.
        </motion.p>

        {/* KokonutUI Floating Action Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
          className="mt-4 w-full max-w-xl mx-auto"
        >
          <ActionSearchBar />
        </motion.div>

        {/* Action Buttons & Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
          className="mt-3.5 flex flex-wrap items-center justify-center gap-3 w-full"
        >
          <Link href="/plan" className="btn-primary !min-h-[40px] !px-4 sm:!px-5 !py-2 !text-xs font-semibold">
            Build a Shortlist
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <Link href="#personas" className="btn-secondary !min-h-[40px] !px-4 sm:!px-5 !py-2 !text-xs font-semibold">
            Explore Demo Personas
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          className="mt-2.5 flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono"
        >
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          <span>No signup required · 1-tap live agent · Zero hallucinated health claims</span>
        </motion.div>

        {/* Interactive Magic UI Animated Taste Graph Beam */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}
          className="mt-4 sm:mt-5 w-full"
        >
          <div className="mb-2 text-center">
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
