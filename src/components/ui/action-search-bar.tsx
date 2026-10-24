"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Sparkles, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/data/mock-catalog";
import { cn } from "@/lib/cn";

export function ActionSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
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

  return (
    <div ref={containerRef} className={cn("relative mx-auto w-full max-w-xl", className)}>
      {/* Floating Action Pill */}
      <div
        onClick={() => setIsOpen(true)}
        className="liquid-glass liquid-glass-specular group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:border-amber-400/40"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            placeholder="Search an artist, movie, or cuisine (e.g. Miles Davis, Casablanca)..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
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
        {isOpen && (results.length > 0 || query.trim().length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="liquid-glass absolute inset-x-0 top-full z-50 overflow-hidden rounded-xl border border-white/[0.12] bg-obsidian-900/95 p-2 shadow-2xl backdrop-blur-2xl"
          >
            {results.length > 0 ? (
              <div className="space-y-1">
                <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                  Qloo Taste Graph Entities
                </p>
                {results.map((item) => (
                  <button
                    key={`${item.type}-${item.qlooId}`}
                    onClick={() => {
                      router.push(
                        `/plan?seedName=${encodeURIComponent(item.name)}&seedType=${item.type}&qlooId=${item.qlooId}`,
                      );
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-white/[0.06] group"
                  >
                    <div>
                      <span className="font-medium text-zinc-100 group-hover:text-amber-300">
                        {item.name}
                      </span>
                      <span className="ml-2 font-mono text-[10px] text-zinc-400">
                        {item.type}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Build with this <Plus className="h-3 w-3" />
                    </span>
                  </button>
                ))}
              </div>
            ) : query.trim() ? (
              <div className="p-4 text-center">
                <p className="text-xs text-zinc-400">No exact Qloo match for &quot;{query}&quot;.</p>
                <button
                  onClick={() => {
                    router.push(`/plan?seedName=${encodeURIComponent(query)}&seedType=cuisine`);
                    setIsOpen(false);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Start custom shortlist with &quot;{query}&quot;
                </button>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
