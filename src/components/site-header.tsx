import Link from "next/link";
import { Logo } from "@/components/logo";
import { Sparkles, ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-obsidian-950/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 sm:h-18 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10 relative">
        {/* Brand identity (Left) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 rounded-lg focus-visible:outline-amber-400 shrink-0 group z-10"
          aria-label="Tablemate home"
        >
          <Logo className="transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="hidden sm:inline font-display text-lg sm:text-xl font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
              Tablemate
            </span>
            <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-widest text-amber-400/80">
              Cultural Dining Agent
            </span>
          </div>
        </Link>

        {/* Live Qloo Status Beacon (True 50% Center) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.3)] pointer-events-none z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-xs text-zinc-300 font-medium whitespace-nowrap">
            Qloo 250M+ Taste Graph Active
          </span>
        </div>

        {/* Navigation & Action (Right) */}
        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-4 shrink-0 z-10">
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
            className="relative inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent px-3.5 sm:px-4 py-2 text-xs font-semibold text-amber-300 backdrop-blur-md transition-all duration-200 hover:border-amber-400/60 hover:bg-amber-500/25 hover:text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-95 shrink-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Build a shortlist</span>
            <span className="sm:hidden">Build</span>
            <ArrowRight className="h-3 w-3 hidden sm:inline text-amber-400/80" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
