import Link from "next/link";
import { Logo } from "@/components/logo";
import { TextSizeControl } from "@/components/text-size-control";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-obsidian-950/80 backdrop-blur-2xl">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4 py-2">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-amber-400"
          aria-label="Tablemate home"
        >
          <Logo />
          <div className="flex flex-col">
            <span className="font-display text-xl font-bold tracking-tight text-zinc-100">
              Tablemate
            </span>
            <span className="hidden font-mono text-[9px] uppercase tracking-widest text-amber-400/90 sm:inline">
              Cultural Dining Agent
            </span>
          </div>
        </Link>

        {/* Live Qloo Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[11px] text-zinc-300">
            Qloo 250M+ Taste Graph Active
          </span>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/#how-it-works"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-400 transition hover:text-zinc-100 md:inline-flex"
          >
            How it works
          </Link>
          <Link
            href="/plan"
            className="btn-secondary !min-h-[42px] !px-4 !text-xs font-semibold !text-zinc-200"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Build Shortlist
          </Link>
          <TextSizeControl />
        </nav>
      </div>
    </header>
  );
}
