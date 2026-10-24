import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { PERSONAS } from "@/data/personas";
import { PersonaCard } from "@/components/persona-card";
import { Disclaimer } from "@/components/disclaimer";
import { HeroSection } from "@/components/hero-section";
import { TasteGlobe } from "@/components/ui/taste-globe";
import { BklitEngineMatrix } from "@/components/bklit-engine-matrix";
import { CallScriptSimulator } from "@/components/call-script-simulator";

export default function HomePage() {
  return (
    <>
      {/* =========================================================
          SECTION 1: HERO & REAL-TIME ACTION CONSOLE
          React Bits WebGL Living Shader + KokonutUI Action Bar + Magic UI Animated Beam
          ========================================================= */}
      <HeroSection />

      {/* =========================================================
          SECTION 2: THE 1-TAP PERSONAS (LIQUID-GLASS DOSSIERS)
          KokonutUI Liquid-Glass Cards with BorderBeam & Spring Physics
          ========================================================= */}
      <section
        id="personas"
        className="scroll-mt-16 border-b border-white/[0.06] bg-[#0c0c10]/40 py-12 sm:py-16 relative"
      >
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-white/[0.06] pb-6">
            <div className="max-w-2xl">
              <span className="eyebrow">Curated Starting Points</span>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-100">
                Start with someone real.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Three distinct individuals with genuine cultural tastes and physical accommodations. One click executes the live agent loop with transparent reasoning.
              </p>
            </div>
            <Link
              href="/plan"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Create custom profile →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
            {PERSONAS.map((persona, index) => (
              <PersonaCard key={persona.id} persona={persona} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: ENGINE & EVIDENCE ARCHITECTURE
          Magic UI 3D Globe + Bklit Caliber Interactive Dual-Layer Matrix
          ========================================================= */}
      <section
        id="how-it-works"
        className="scroll-mt-16 border-b border-white/[0.06] py-12 sm:py-16 relative overflow-hidden"
      >
        {/* Subtle background aura */}
        <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 h-[32rem] w-[32rem] rounded-full bg-amber-500/5 blur-3xl" />

        <div className="container-page space-y-8">
          {/* Section Header */}
          <div className="max-w-3xl border-b border-white/[0.06] pb-6">
            <span className="eyebrow">Methodology & AI Auditability</span>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-100">
              Taste first. Needs second. Evidence always.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Generic search algorithms start with generic categories. Tablemate solves the two-body problem: mapping latent cultural affinities across 250M+ entities while deterministically enforcing clinical kitchen reality.
            </p>
          </div>

          {/* Bento Architecture: 3D Globe on Left, Bklit Engine Matrix on Right */}
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            {/* Left: Magic UI 3D Cultural Hubs Globe */}
            <div className="liquid-glass liquid-glass-specular relative flex flex-col items-center justify-center p-5 sm:p-6 text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Sparkles className="h-3 w-3" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                  Global Cultural Latent Space
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 max-w-xs mb-2">
                Real-time 3D graph connecting cuisine profiles across New York, Chicago, San Francisco, Rome, Paris, and Tokyo.
              </p>

              <TasteGlobe className="my-1" />

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> NYC · Cobble Hill
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> CHI · Lincoln Park
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> SF · North Beach
                </span>
              </div>
            </div>

            {/* Right: Bklit Interactive Decision Matrix */}
            <div>
              <BklitEngineMatrix />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: 30-SECOND HOST CALL SCRIPT & FINALE CTA
          Interactive Call Simulator + High-Craft Conversion Anchor
          ========================================================= */}
      <section
        id="verification"
        className="scroll-mt-16 py-12 sm:py-16 relative overflow-hidden"
      >
        <div className="container-page space-y-8">
          {/* Host Call Script Simulator */}
          <CallScriptSimulator />

          {/* High-Craft Conversion Anchor Card */}
          <div className="liquid-glass liquid-glass-specular relative overflow-hidden p-6 sm:p-10 text-center">
            {/* Ambient gold glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-[32rem] rounded-full bg-amber-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-xl">
              <span className="eyebrow">Zero Guesswork Dining</span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-100">
                Better dinners begin with cultural understanding.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Experience the live agent with Sylvia in Brooklyn, or assemble your parent&apos;s shortlist from scratch in under two minutes.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/results?persona=p1"
                  className="btn-primary !min-h-[40px] !px-5 !text-xs font-semibold"
                >
                  Launch Sylvia&apos;s Shortlist
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <Link href="/plan" className="btn-secondary !min-h-[40px] !px-5 !text-xs font-semibold">
                  Build Custom Shortlist
                </Link>
              </div>
            </div>
          </div>

          {/* Transparent Medical & Dietary Disclaimer */}
          <div className="mt-2">
            <Disclaimer compact />
          </div>
        </div>
      </section>
    </>
  );
}
