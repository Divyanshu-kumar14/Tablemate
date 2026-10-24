"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Plus, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/data/mock-catalog";
import { cn } from "@/lib/cn";

const POPULAR_SEEDS = [
  { name: "Miles Davis", type: "artist", qlooId: "seed-miles" },
  { name: "Casablanca", type: "movie", qlooId: "seed-casa" },
  { name: "Northern Italian", type: "cuisine", qlooId: "seed-ital" },
  { name: "Dim Sum", type: "cuisine", qlooId: "seed-dim" },
  { name: "Frank Sinatra", type: "artist", qlooId: "seed-frank" },
];

export function ActionSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const selectSeed = (item: { name: string; type: string; qlooId?: string }) => {
    router.push(
      `/plan?seedName=${encodeURIComponent(item.name)}&seedType=${item.type}${item.qlooId ? `&qlooId=${item.qlooId}` : ""}`,
    );
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative mx-auto w-full max-w-xl", className)}>
      {/* KokonutUI Apple 2025 Liquid Glass Floating Action Pill */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className="liquid-glass liquid-glass-specular group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 border border-white/[0.12] bg-obsidian-900/80 backdrop-blur-2xl transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20 border border-amber-500/20">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            aria-label="Search cultural tastes"
            placeholder="Search artist, film, or cuisine (e.g. Miles Davis, Casablanca)..."
            className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          ) : (
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border border-white/[0.1] bg-white/[0.04] px-2 font-mono text-[10px] font-medium text-zinc-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Suggestions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="liquid-glass absolute inset-x-0 top-full z-50 mt-1 max-h-[60vh] overflow-y-auto rounded-xl border border-white/[0.15] bg-obsidian-900/95 p-3 shadow-2xl backdrop-blur-3xl"
          >
            {results.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between px-3 py-1 text-zinc-400">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold">
                    Qloo Taste Graph Matches
                  </span>
                  <span className="font-mono text-[10px] text-zinc-500">250M+ Entities</span>
                </div>
                {results.map((item) => (
                  <button
                    key={`${item.type}-${item.qlooId}`}
                    onClick={() => selectSeed(item)}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.08] group"
                  >
                    <div>
                      <span className="font-semibold text-zinc-100 group-hover:text-amber-300 transition-colors">
                        {item.name}
                      </span>
                      <span className="ml-2 font-mono text-[10px] uppercase text-zinc-400">
                        {item.type}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Build Shortlist <ArrowRight className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center">
                <p className="text-xs text-zinc-400">No exact Qloo match for &quot;{query}&quot;.</p>
                <button
                  onClick={() => selectSeed({ name: query.trim(), type: "cuisine" })}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Start custom shortlist with &quot;{query}&quot;
                </button>
              </div>
            ) : (
              /* Quick Suggested Seeds when Query is Empty */
              <div className="p-2 space-y-2">
                <p className="px-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
                  Popular Cultural Signals to Start With:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_SEEDS.map((seed) => (
                    <button
                      key={seed.name}
                      onClick={() => selectSeed(seed)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-300"
                    >
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>{seed.name}</span>
                      <span className="font-mono text-[9px] uppercase text-zinc-500">
                        {seed.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
