import Link from "next/link";
import { ArrowRight, Check, Film, Music, Phone, Utensils } from "lucide-react";
import { PERSONAS } from "@/data/personas";
import { PersonaCard } from "@/components/persona-card";
import { EvidenceChip } from "@/components/evidence-chip";
import { Disclaimer } from "@/components/disclaimer";
import { EVIDENCE_COPY } from "@/lib/labels";

const STEPS = [
  {
    title: "Pick 1–5 taste signals",
    body: "An artist, a film, a show, a restaurant, or a cuisine. Qloo turns them into a taste graph, not a keyword search.",
  },
  {
    title: "Tell us what makes eating hard",
    body: "Texture, sodium, diet, noise, mobility. Deterministic rules apply the needs. The language model only writes the taste note.",
  },
  {
    title: "Get a shortlist and a script",
    body: "Five cards, each labeled reported, likely, or ask. Every card ends with the exact questions to ask before booking.",
  },
];

function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[30rem] lg:mx-0">
      <div
        className="absolute inset-0 translate-x-3 translate-y-4 rotate-2 rounded-xl2 border border-line bg-paper/55"
        aria-hidden="true"
      />
      <div className="relative card-paper overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-line/70 bg-cream/60 px-5 py-3">
          <span className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-amber">
            Sample preview
          </span>
          <span className="text-[0.9rem] text-muted">Brooklyn, NY</span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Sylvia&apos;s shortlist</p>
              <h2 className="mt-2 font-display text-[2rem] leading-tight">
                Cobble Hill Trattoria
              </h2>
              <p className="mt-1 text-[0.95rem] text-muted">Italian · $$</p>
            </div>
            <span className="rounded-full bg-teal-light px-3 py-1 text-[0.8rem] font-semibold text-teal-dark">
              Top pick
            </span>
          </div>

          <p className="mt-5 border-l-2 border-teal/30 pl-4 font-display text-[1.25rem] leading-snug">
            “A quiet Italian room that Qloo links to fans of Miles Davis and Casablanca.”
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <EvidenceChip item={{ need: "Quiet room", label: "reported" }} />
            <EvidenceChip item={{ need: "Soft texture", label: "likely" }} />
            <EvidenceChip item={{ need: "Very soft options", label: "ask" }} />
          </div>

          <div className="mt-5 rounded-xl border border-teal/20 bg-teal-light/45 p-4">
            <p className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-teal-dark">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Before you go
            </p>
            <p className="mt-2 font-display text-[1.15rem] leading-snug">
              “Can the kitchen make dishes soft enough to cut with a fork?”
            </p>
          </div>

          <div className="mt-5 flex items-center gap-4 border-t border-line/70 pt-4 text-[0.85rem] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Music className="h-4 w-4" aria-hidden="true" />
              Miles Davis
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Film className="h-4 w-4" aria-hidden="true" />
              Casablanca
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Utensils className="h-4 w-4" aria-hidden="true" />
              Italian
            </span>
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.85rem] text-muted lg:text-left">
        Fictional venue shown for layout. Sample data is always labeled.
      </p>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-page grid gap-12 pb-14 pt-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
          <div>
            <p className="eyebrow">For caregivers and the people they love</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,8vw,5.3rem)] font-semibold leading-[0.98] tracking-[-0.02em]">
              Good taste <span className="text-teal">doesn&apos;t</span> retire.
            </h1>
            <p className="mt-6 max-w-xl text-[1.2rem] leading-relaxed text-muted">
              A short, honest restaurant shortlist for an aging parent — shaped by what they
              love and how they eat. Then a 30-second call script to confirm what the data
              can&apos;t tell you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/plan" className="btn-primary">
                Build a shortlist
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link href="#personas" className="btn-secondary">
                Start with a persona
              </Link>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[0.9rem] text-muted">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
              No account. No medical claims. Five places, not fifty.
            </p>
          </div>

          <HeroPreview />
        </div>
      </section>

      <section id="personas" className="scroll-mt-24 border-y border-line/70 bg-paper/45 py-16 sm:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="eyebrow">The demo path</p>
            <h2 className="mt-3 font-display text-[2.5rem] font-semibold leading-tight sm:text-[3rem]">
              Start with someone real.
            </h2>
            <p className="mt-3 text-[1.05rem] leading-relaxed text-muted">
              Three personas, three different sets of needs. One tap runs the full agent — no
              form filling, no key required.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {PERSONAS.map((persona, index) => (
              <PersonaCard key={persona.id} persona={persona} index={index} />
            ))}
          </div>

          <p className="mt-5 text-[0.9rem] text-muted">
            Personas are composites, not real people. Venues in sample mode are fictional and
            labeled.
          </p>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-display text-[2.5rem] font-semibold leading-tight">
              Taste first. Needs second. Evidence always.
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
              Most restaurant search starts with a cuisine and a location. This starts with a
              person: the music they wore out, the film they quote, the food they grew up on.
            </p>
            <Link href="/plan" className="prose-link mt-6 inline-flex items-center gap-2">
              Build one from scratch
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ol className="space-y-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-5 rounded-xl2 border border-line bg-paper/70 p-5 sm:p-6"
              >
                <span
                  className="font-display text-[2rem] leading-none text-teal/70"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[1.25rem] font-semibold leading-snug">{step.title}</h3>
                  <p className="mt-1 text-[1rem] leading-relaxed text-muted">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-teal-dark text-cream">
        <div className="container-page grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow text-teal-light">The honesty rule</p>
            <h2 className="mt-3 font-display text-[2.5rem] font-semibold leading-tight sm:text-[3rem]">
              We don&apos;t call a restaurant safe.
            </h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-cream/80">
              &ldquo;Safe&rdquo; is a claim about a kitchen on a Tuesday night. We can&apos;t
              make it. What we can do is tell you what the data supports, what it merely
              suggests, and what only a phone call can answer.
            </p>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-cream/80">
              No green checkmark that means &ldquo;approved.&rdquo; No medical advice. Just a
              clearer conversation.
            </p>
          </div>

          <div className="space-y-3">
            {(["reported", "likely", "ask"] as const).map((label) => (
              <div key={label} className="rounded-xl border border-white/15 bg-white/5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "h-3 w-3 rounded-full",
                      label === "reported"
                        ? "bg-[#86EFAC]"
                        : label === "likely"
                          ? "bg-[#FCD34D]"
                          : "bg-[#CBD5E1]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <h3 className="text-[1.25rem] font-semibold text-cream">
                    {EVIDENCE_COPY[label].label}
                  </h3>
                  <span className="text-[0.85rem] text-cream/60">
                    {EVIDENCE_COPY[label].short}
                  </span>
                </div>
                <p className="mt-2 text-[1rem] leading-relaxed text-cream/75">
                  {EVIDENCE_COPY[label].description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-page">
          <div className="card-paper relative overflow-hidden p-7 sm:p-12">
            <div
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-teal-light/70 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative max-w-2xl">
              <p className="eyebrow">One tap, one shortlist</p>
              <h2 className="mt-3 font-display text-[2.5rem] font-semibold leading-tight">
                The next dinner starts with a better question.
              </h2>
              <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">
                Pick a persona to see the full flow, or build a shortlist from your own
                taste.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link href="/results?persona=p1" className="btn-primary">
                  Try Sylvia&apos;s shortlist
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <Link href="/plan" className="btn-secondary">
                  Build your own
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
