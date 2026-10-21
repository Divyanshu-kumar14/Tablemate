import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Persona } from "@/data/personas";
import { needsSummary } from "@/lib/labels";

export function PersonaCard({ persona, index }: { persona: Persona; index: number }) {
  const needs = needsSummary(persona.needs);

  return (
    <Link
      href={`/results?persona=${persona.id}`}
      className="group card-paper flex flex-col p-6 transition duration-200 hover:-translate-y-1 hover:border-teal/40 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-4">
        <p className="eyebrow">
          Persona {String(index + 1).padStart(2, "0")} · {persona.location}
        </p>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-teal-light font-display text-lg text-teal-dark">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 font-display text-[2rem] leading-tight">
        {persona.name}, {persona.age}
      </h3>
      <p className="mt-1 text-[0.95rem] font-semibold text-teal">{persona.relationship}</p>
      <p className="mt-3 text-[1rem] leading-relaxed text-muted">{persona.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {needs.slice(0, 5).map((need) => (
          <span key={need} className="chip">
            {need}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <span className="inline-flex items-center gap-2 text-[1.05rem] font-semibold text-teal">
          See {persona.name}&apos;s shortlist
          <ArrowRight
            className="h-5 w-5 transition group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
