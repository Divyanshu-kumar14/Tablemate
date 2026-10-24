import Link from "next/link";
import { ArrowRight, Check, Sparkles, Shield, Compass, HeartHandshake } from "lucide-react";
import { PERSONAS } from "@/data/personas";
import { PersonaCard } from "@/components/persona-card";
import { Disclaimer } from "@/components/disclaimer";
import { TasteGraphBeam } from "@/components/taste-graph-beam";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { EVIDENCE_COPY } from "@/lib/labels";

const STEPS = [
  {
    icon: Compass,
    title: "1. Select 1 to 5 cultural tastes",
    body: "An artist, film, or cuisine. Qloo maps latent cultural correlations across 250M+ entities rather than relying on blunt keyword lookups.",
  },
  {
    icon: HeartHandshake,
    title: "2. Specify dining accommodations",
    body: "Texture modifications, lower-sodium cooking, quiet seating, or step-free entrances. A deterministic rules engine evaluates candidates against real kitchen realities.",
  },
  {
    icon: Shield,
    title: "3. Receive a shortlist and phone script",
    body: "Every recommendation includes transparent evidence tags (Reported, Likely, Ask) and an exact 30-second verification script to call the host before booking.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[32rem] w-[54rem] rounded-full bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl" />

        <div className="container-page relative z-10 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-widest text-amber-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Cultural Intelligence Meets Senior Care</span>
            </div>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[1.02] tracking-tight text-zinc-100">
              Good taste <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">doesn&apos;t</span> retire.
            </h1>

            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-zinc-300">
              A restaurant shortlist for an aging parent, shaped by the music and films they love, calibrated for texture, sodium, and mobility, and verified with a 30-second call script.
            </p>

            {/* KokonutUI Floating Action Search Bar */}
            <div className="mt-8">
              <ActionSearchBar />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <Link href="/plan" className="btn-primary">
                Build a Shortlist
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="#personas" className="btn-secondary">
                Explore Demo Personas
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-400 font-mono">
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>No signup required · 1-tap live agent · Zero hallucinated health claims</span>
            </div>
          </div>

          {/* Interactive Magic UI Animated Taste Graph Beam */}
          <div className="mt-12 sm:mt-16">
            <div className="mb-3 text-center">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">
                Interactive Engine Architecture · Sample preview
              </span>
            </div>
            <TasteGraphBeam />
          </div>
        </div>
      </section>

      {/* Demo Personas Section */}
      <section id="personas" className="scroll-mt-24 border-y border-white/[0.08] bg-obsidian-900/60 py-16 sm:py-24">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow">The 1-Tap Judge Path</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                Start with someone real.
              </h2>
              <p className="mt-2 text-base text-zinc-400">
                Three distinct individuals with genuine cultural tastes and physical accommodations. One click executes the end-to-end agent loop.
              </p>
            </div>
            <Link href="/plan" className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto">
              Create custom profile →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PERSONAS.map((persona, index) => (
              <PersonaCard key={persona.id} persona={persona} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works / 3-Step Process */}
      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 items-start">
          <div>
            <p className="eyebrow">Methodology</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
              Taste first. Needs second. Evidence always.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              Generic search algorithms start with generic categories. Tablemate starts with human identity: the records they played, the movies they cherish, and the regional dishes they grew up on.
            </p>
            <div className="mt-6">
              <Link href="/plan" className="btn-secondary !min-h-[46px] !text-sm">
                Build from scratch →
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="liquid-glass liquid-glass-specular flex gap-4 p-5 sm:p-6"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{step.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Honesty Rule / Evidence Framework */}
      <section className="border-t border-white/[0.08] bg-obsidian-900/80 py-16 sm:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">Auditability & AI Safety</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
              We never label a restaurant &ldquo;safe.&rdquo;
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              A claim of medical compliance cannot be guaranteed from a software database. Tablemate replaces dangerous automated assumptions with transparent, categorized evidence.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Every dietary and texture factor is labeled Reported, Likely, or Ask, empowering caregivers to verify exact kitchen preparations directly.
            </p>
          </div>

          <div className="space-y-3.5">
            {(["reported", "likely", "ask"] as const).map((label) => (
              <div
                key={label}
                className="liquid-glass liquid-glass-specular rounded-xl border border-white/[0.08] bg-obsidian-850/80 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full",
                        label === "reported"
                          ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                          : label === "likely"
                            ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                            : "bg-slate-400",
                      ].join(" ")}
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-semibold text-zinc-100">
                      {EVIDENCE_COPY[label].label}
                    </h3>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                    {EVIDENCE_COPY[label].short}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                  {EVIDENCE_COPY[label].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action & Disclaimer */}
      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="liquid-glass liquid-glass-specular relative overflow-hidden p-8 sm:p-12 text-center">
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <span className="eyebrow">Zero Guesswork</span>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-100">
                Better dinners begin with cultural understanding.
              </h2>
              <p className="mt-4 text-base text-zinc-300">
                Experience the live agent with Sylvia in Brooklyn, or assemble your own shortlist.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/results?persona=p1" className="btn-primary">
                  Launch Sylvia&apos;s Shortlist
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link href="/plan" className="btn-secondary">
                  Build Your Own
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Disclaimer compact />
          </div>
        </div>
      </section>
    </>
  );
}
