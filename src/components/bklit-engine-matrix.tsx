"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ShieldCheck,
  Activity,
  Layers,
  Heart,
  Volume2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/cn";

type TabType = "qloo" | "accommodations" | "evidence";

interface AffinityItem {
  domain: string;
  seed: string;
  targetVenue: string;
  affinity: number;
  trait: string;
}

const AFFINITY_DATA: AffinityItem[] = [
  {
    domain: "Music",
    seed: "Miles Davis (Kind of Blue)",
    targetVenue: "Intimate Dimly-Lit Jazz Bistro",
    affinity: 94,
    trait: "Mid-century cool jazz, warm acoustics, relaxed tempo",
  },
  {
    domain: "Cinema",
    seed: "Casablanca (Michael Curtiz)",
    targetVenue: "Classic Mid-Century Brasserie",
    affinity: 91,
    trait: "Art-deco room, booth seating, attentive table service",
  },
  {
    domain: "Cuisine",
    seed: "Northern Italian Heritage",
    targetVenue: "Cobble Hill Trattoria",
    affinity: 96,
    trait: "Slow-simmered ragu, fork-tender polenta, olive oil base",
  },
  {
    domain: "Cinema",
    seed: "Federico Fellini (8½)",
    targetVenue: "Old-World North Beach Ristorante",
    affinity: 88,
    trait: "Nostalgic espresso bar, operatic warmth, soft pasta",
  },
];

interface AccommodationCheck {
  category: string;
  spec: string;
  standard: string;
  status: "pass" | "audit";
  detail: string;
}

const ACCOMMODATION_CHECKS: AccommodationCheck[] = [
  {
    category: "Texture Mechanics",
    spec: "IDDSI Level 6 (Soft & Bite-Sized)",
    standard: "Fork-pressure test (food breaks with side of fork, <15mm pieces)",
    status: "pass",
    detail: "Braised osso buco, creamy mascarpone polenta, steamed branzino",
  },
  {
    category: "Sodium Threshold",
    spec: "Cardiac / Renal Preference",
    standard: "Custom sauce on side, unbrined cooking",
    status: "pass",
    detail: "Prep allows chef to omit finishing sea salt and serve reduction apart",
  },
  {
    category: "Acoustics & Hearing",
    spec: "Speech Intelligibility (<65 dB)",
    standard: "Acoustic ceiling baffles, banquettes, no blaring sound system",
    status: "pass",
    detail: "Back dining parlor tested at 58dB during 6:30 PM peak service",
  },
  {
    category: "Mobility & Access",
    spec: "Step-Free Navigation",
    standard: "Zero entry stairs, wide floor aisles, ADA-compliant restroom",
    status: "pass",
    detail: "Street-level entrance ramp and flat-threshold bathroom stall",
  },
];

export function BklitEngineMatrix() {
  const [activeTab, setActiveTab] = useState<TabType>("qloo");
  const [selectedAffinity, setSelectedAffinity] = useState<number>(0);

  return (
    <div className="relative mx-auto w-full">
      {/* Specular Ambient Glow */}
      <div className="pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent blur-3xl" />

      <div className="liquid-glass liquid-glass-specular relative overflow-hidden rounded-2xl border border-white/[0.1] bg-obsidian-900/90 p-5 sm:p-8 backdrop-blur-2xl">
        {/* Top Header & Tab Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Activity className="h-3.5 w-3.5" />
              </span>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-400 font-bold">
                Tablemate Engine Architecture
              </span>
            </div>
            <h3 className="mt-1.5 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
              The Dual-Layer Decision Matrix
            </h3>
          </div>

          {/* Interactive Bklit Tabs */}
          <div className="flex items-center rounded-xl border border-white/[0.1] bg-white/[0.03] p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("qloo")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "qloo"
                  ? "bg-amber-500 text-obsidian-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>1. Cultural Affinity</span>
            </button>
            <button
              onClick={() => setActiveTab("accommodations")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "accommodations"
                  ? "bg-amber-500 text-obsidian-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>2. Accommodations</span>
            </button>
            <button
              onClick={() => setActiveTab("evidence")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                activeTab === "evidence"
                  ? "bg-amber-500 text-obsidian-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]"
                  : "text-zinc-400 hover:text-zinc-100",
              )}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>3. Honesty Audit</span>
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        <div className="pt-6">
          <AnimatePresence mode="wait">
            {activeTab === "qloo" && (
              <motion.div
                key="qloo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-zinc-300">
                    <strong className="text-zinc-100">Qloo Taste Correlation Layer:</strong> Maps latent
                    cultural affinities between beloved media and real culinary spaces across 250M+ entities.
                  </p>
                  <span className="font-mono text-[10px] text-amber-400/90 whitespace-nowrap">
                    Interactive correlation models
                  </span>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {AFFINITY_DATA.map((item, idx) => (
                    <div
                      key={item.seed}
                      onClick={() => setSelectedAffinity(idx)}
                      className={cn(
                        "group relative cursor-pointer rounded-xl border p-4 transition-all duration-200",
                        selectedAffinity === idx
                          ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/30"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.05]",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400/90 font-semibold">
                          {item.domain} Input Seed
                        </span>
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-400">
                          <Activity className="h-3 w-3" />
                          <span>{item.affinity}% Correlation</span>
                        </div>
                      </div>

                      <h4 className="mt-2 text-sm font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {item.seed}
                      </h4>
                      <p className="mt-1 text-xs text-zinc-400 font-medium">
                        Matches: <span className="text-zinc-200">{item.targetVenue}</span>
                      </p>

                      {/* Bklit Styled Progress Meter */}
                      <div className="mt-3.5">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                          <span>Latent Affinity Vector</span>
                          <span className="text-amber-300">{item.affinity}/100</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.affinity}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                          />
                        </div>
                      </div>

                      <p className="mt-2.5 text-[11px] text-zinc-400 leading-relaxed italic border-t border-white/[0.04] pt-2">
                        &ldquo;{item.trait}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "accommodations" && (
              <motion.div
                key="accommodations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <p className="text-xs text-zinc-300">
                    <strong className="text-zinc-100">Deterministic Physical Filtering:</strong> Hard
                    constraints evaluated against kitchen reality, texture scales, and dining acoustics.
                  </p>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                    100% Deterministic · Zero Hallucination
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {ACCOMMODATION_CHECKS.map((check) => (
                    <div
                      key={check.category}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-all hover:border-white/[0.16] hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                        <span className="font-mono text-xs font-semibold text-amber-400">
                          {check.category}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Validated
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <h4 className="text-sm font-semibold text-zinc-100">{check.spec}</h4>
                        <p className="mt-0.5 text-[11px] text-zinc-400 font-mono">{check.standard}</p>
                      </div>

                      <div className="mt-3 rounded-lg border border-white/[0.04] bg-obsidian-950/60 p-2 text-xs text-zinc-300">
                        <span className="font-semibold text-amber-300/90 font-mono text-[10px] uppercase block mb-0.5">
                          Verified Candidate Dish / Environment
                        </span>
                        {check.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "evidence" && (
              <motion.div
                key="evidence"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-4">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    Why we refuse to label any restaurant &ldquo;100% Safe&rdquo;
                  </h4>
                  <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                    Generic AI models hallucinate medical safety guarantees based on marketing copy.
                    Tablemate enforces a clinical-grade evidence hierarchy so caregivers know exactly what
                    is known, what is probable, and what to verify on the phone.
                  </p>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-3">
                  {/* Reported */}
                  <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <h4 className="text-sm font-bold text-emerald-300">Reported</h4>
                    </div>
                    <span className="mt-1 block font-mono text-[10px] text-zinc-500 uppercase">
                      Documented Menu Fact
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      Dishes explicitly documented on published kitchen menus, allergen matrices, or certified
                      step-free entrance ramps.
                    </p>
                  </div>

                  {/* Likely */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      <h4 className="text-sm font-bold text-amber-300">Likely</h4>
                    </div>
                    <span className="mt-1 block font-mono text-[10px] text-zinc-500 uppercase">
                      Culinary Mechanics
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      Inferred from preparation chemistry (e.g., risotto or polenta naturally requires gentle
                      mastication and soft bite force).
                    </p>
                  </div>

                  {/* Ask */}
                  <div className="rounded-xl border border-zinc-500/20 bg-zinc-900/40 p-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />
                      <h4 className="text-sm font-bold text-slate-200">Ask</h4>
                    </div>
                    <span className="mt-1 block font-mono text-[10px] text-zinc-500 uppercase">
                      Host Call Checkpoint
                    </span>
                    <p className="mt-2 text-xs leading-relaxed text-zinc-300">
                      Variables requiring live human host verification (e.g. daily sauce reduction salt,
                      exact restroom doorstep thresholds).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
