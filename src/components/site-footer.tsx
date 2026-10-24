import Link from "next/link";
import { Logo } from "@/components/logo";
import { ShieldAlert, Database, Sparkles } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-obsidian-950/80 backdrop-blur-xl">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Tablemate home">
            <Logo />
            <span className="font-display text-2xl font-bold text-zinc-100">Tablemate</span>
          </Link>
          <p className="mt-4 max-w-sm font-display text-lg leading-snug text-zinc-400">
            Good taste doesn&apos;t retire.
          </p>
          <p className="mt-2 text-xs text-zinc-500 font-mono">
            Powered by Qloo Cultural Intelligence & Gemini Agentic Reasoning
          </p>
        </div>

        <div>
          <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
            <ShieldAlert className="h-3.5 w-3.5" /> Honest Health Contract
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            A research and shortlist tool for family caregivers. Never replaces professional medical advice. Always confirms dietary, texture, and physical accessibility needs with the venue before booking.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium">
            <Link href="/plan" className="text-amber-400 hover:text-amber-300 transition-colors">
              Build a shortlist →
            </Link>
            <Link href="/#how-it-works" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              How it works
            </Link>
          </div>
        </div>

        <div>
          <h2 className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
            <Database className="h-3.5 w-3.5" /> Cultural Taste Graph
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Cultural correlation signals are calculated through Qloo&apos;s 250M+ entity graph across film, music, literature, and dining.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Auditable AI with zero hallucinated compliance</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="container-page flex flex-col justify-between gap-3 py-6 text-xs text-zinc-500 sm:flex-row">
          <p>© 2026 Tablemate. Built for the Qloo Agentic Hackathon.</p>
          <p className="font-mono">No accounts required · Transparent 3-tier evidence model</p>
        </div>
      </div>
    </footer>
  );
}
