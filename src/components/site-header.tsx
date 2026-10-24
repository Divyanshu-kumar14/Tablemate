"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Sparkles, ArrowRight } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08080b]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 sm:h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity (Left) */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-amber-400 group shrink-0"
          aria-label="Tablemate home"
        >
          <Logo className="transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-zinc-100 group-hover:text-amber-300 transition-colors">
              Tablemate
            </span>
          </div>
        </Link>

        {/* Clean Center Navigation */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1 backdrop-blur-md">
          <Link
            href="/#personas"
            className="rounded-full px-3 py-1 text-xs font-medium text-zinc-400 transition hover:text-zinc-100 hover:bg-white/[0.06]"
          >
            Personas
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-full px-3 py-1 text-xs font-medium text-zinc-400 transition hover:text-zinc-100 hover:bg-white/[0.06]"
          >
            Architecture
          </Link>
          <Link
            href="/#verification"
            className="rounded-full px-3 py-1 text-xs font-medium text-zinc-400 transition hover:text-zinc-100 hover:bg-white/[0.06]"
          >
            30s Call Script
          </Link>
        </nav>

        {/* Right Action & Status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Qloo Graph</span>
          </div>

          <Link
            href="/plan"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95"
          >
            <Sparkles className="h-3 w-3 text-zinc-950" />
            <span>Build shortlist</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </header>
  );
}
