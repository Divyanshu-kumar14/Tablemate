import Link from "next/link";
import { Logo } from "@/components/logo";
import { Sparkles, ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-2xl">
      <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-4">
        {/* Brand identity */}
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-amber-400 shrink-0 group"
          aria-label="Tablemate home"
        >
          <Logo className="transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="hidden sm:inline font-display text-xl font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
              Tablemate
            </span>
            <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-amber-400/80">
              Cultural Dining Agent
            </span>
          </div>
        </Link>

        {/* Live Qloo Status Beacon (Center) */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs text-zinc-300 font-medium">
            Qloo 250M+ Taste Graph Active
          </span>
        </div>

        {/* Navigation & Action (Right) */}
        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            href="/#personas"
            className="hidden sm:inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-100 hover:bg-white/[0.04]"
          >
            Personas
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden md:inline-flex rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-400 transition hover:text-zinc-100 hover:bg-white/[0.04]"
          >
            How it works
          </Link>
          <Link
            href="/plan"
            className="btn-primary !min-h-[40px] sm:!min-h-[44px] !px-4 sm:!px-5 !py-2 !text-xs font-semibold"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Build a shortlist</span>
            <span className="sm:hidden">Build</span>
            <ArrowRight className="h-3 w-3 hidden sm:inline" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
