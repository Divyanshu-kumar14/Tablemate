"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Search, X, Sparkles } from "lucide-react";
import type { SeedType, TasteSeed } from "@/types/domain";
import { SEED_TYPE_LABEL } from "@/lib/labels";
import { cn } from "@/lib/cn";

interface TasteSearchResult {
  name: string;
  type: SeedType;
  qlooId: string;
  subtitle?: string;
}

const TYPES: Array<{ value: SeedType; label: string }> = [
  { value: "artist", label: "Artist" },
  { value: "movie", label: "Film" },
  { value: "tv", label: "TV" },
  { value: "restaurant", label: "Restaurant" },
  { value: "cuisine", label: "Cuisine" },
];

const EXAMPLES: Array<{ label: string; type: SeedType; query: string }> = [
  { label: "Miles Davis", type: "artist", query: "Miles Davis" },
  { label: "Casablanca", type: "movie", query: "Casablanca" },
  { label: "Italian", type: "cuisine", query: "Italian" },
  { label: "Frank Sinatra", type: "artist", query: "Frank Sinatra" },
];

export function TasteInput({
  value,
  onChange,
  max = 5,
}: {
  value: TasteSeed[];
  onChange: (next: TasteSeed[]) => void;
  max?: number;
}) {
  const [type, setType] = useState<SeedType>("artist");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TasteSearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [open, setOpen] = useState(false);
  const requestId = useRef(0);
  const full = value.length >= max;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setStatus("idle");
      setOpen(false);
      return;
    }

    const current = ++requestId.current;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          `/api/v1/search?q=${encodeURIComponent(trimmed)}&type=${type}`,
          { signal: controller.signal },
        );
        const payload = (await response.json().catch(() => null)) as
          | { results?: TasteSearchResult[]; error?: { message?: string } }
          | null;
        if (!response.ok) {
          throw new Error(payload?.error?.message ?? "Search failed");
        }
        if (requestId.current !== current) return;
        setResults(Array.isArray(payload?.results) ? payload.results : []);
        setStatus("idle");
        setOpen(true);
      } catch {
        if (controller.signal.aborted || requestId.current !== current) return;
        setStatus("error");
        setOpen(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, type]);

  function addResult(result: TasteSearchResult) {
    if (full) return;
    const duplicate = value.some(
      (seed) =>
        seed.qlooId === result.qlooId ||
        (seed.name.toLowerCase() === result.name.toLowerCase() && seed.type === result.type),
    );
    if (!duplicate) {
      onChange([
        ...value,
        { name: result.name, type: result.type, qlooId: result.qlooId },
      ]);
    }
    setQuery("");
    setResults([]);
    setOpen(false);
    setStatus("idle");
  }

  function removeSeed(qlooId: string) {
    onChange(value.filter((seed) => seed.qlooId !== qlooId));
  }

  return (
    <div>
      {/* Type Pill Selector */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Taste type">
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            aria-pressed={type === option.value}
            className={cn(
              "inline-flex min-h-[42px] items-center rounded-full border px-4 text-xs font-semibold transition-all duration-200",
              type === option.value
                ? "border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/[0.2] hover:text-zinc-200",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <label htmlFor="taste-search" className="label-lg">
          Search for a favorite
        </label>
        <div className="relative mt-2">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />
          <input
            id="taste-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.preventDefault();
            }}
            disabled={full}
            placeholder={
              full
                ? "Maximum signals reached"
                : `Search ${SEED_TYPE_LABEL[type].toLowerCase()}s...`
            }
            className="field !pl-12"
            autoComplete="off"
            aria-describedby="taste-help"
            aria-busy={status === "loading"}
          />
          {status === "loading" && (
            <Loader2
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-amber-400"
              aria-hidden="true"
            />
          )}
        </div>

        <p id="taste-help" className="helper">
          Add 1–5 signals. Two or three give Qloo stronger cross-domain correlations.{" "}
          {full ? "Maximum reached." : `${value.length} of ${max} added.`}
        </p>

        {status === "error" && (
          <p
            role="alert"
            className="mt-2 rounded-lg border border-amber-500/30 bg-amber-950/40 p-3 text-xs text-amber-300"
          >
            Search is unavailable right now. Try choosing a cuisine tag or start from a persona.
          </p>
        )}

        {/* Results dropdown */}
        {open && status !== "error" && (
          <div className="liquid-glass mt-2 overflow-hidden rounded-xl border border-white/[0.12] bg-obsidian-900/95 p-2 shadow-2xl backdrop-blur-2xl">
            {status === "loading" && results.length === 0 ? (
              <p className="flex items-center gap-2 px-3 py-3 text-xs text-zinc-400">
                <Loader2 className="h-4 w-4 animate-spin text-amber-400" aria-hidden="true" />
                Querying Qloo taste graph...
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-3 text-xs text-zinc-400">
                No matching entities in Qloo. Try an alternate spelling.
              </p>
            ) : (
              <ul className="divide-y divide-white/[0.06]" aria-label="Search results">
                {results.map((result) => {
                  const selected = value.some((seed) => seed.qlooId === result.qlooId);
                  return (
                    <li key={`${result.type}:${result.qlooId}`}>
                      <button
                        type="button"
                        onClick={() => addResult(result)}
                        disabled={selected || full}
                        className="flex min-h-[52px] w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <div>
                          <span className="block text-sm font-semibold text-zinc-100">{result.name}</span>
                          <span className="block font-mono text-[11px] text-zinc-400">
                            {result.subtitle ?? SEED_TYPE_LABEL[result.type]}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                          {selected ? (
                            <span className="text-zinc-500">Added</span>
                          ) : (
                            <>
                              <Plus className="h-4 w-4" aria-hidden="true" />
                              Add
                            </>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Suggested Quick Picks */}
      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Curated Examples
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                addResult({
                  name: example.label,
                  type: example.type,
                  qlooId: `mock:${example.type}:${example.label.toLowerCase().replace(/\s+/g, "-")}`,
                  subtitle: SEED_TYPE_LABEL[example.type],
                });
              }}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-zinc-300 transition-colors hover:border-amber-400/40 hover:text-amber-300"
            >
              <Sparkles className="h-3 w-3 text-amber-400/70" />
              {example.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Taste Chips */}
      <div className="mt-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
          Active Seeds ({value.length})
        </p>
        {value.length === 0 ? (
          <p className="mt-2 text-xs text-zinc-500">
            No taste signals added yet. Add an artist, film, or cuisine above.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected taste signals">
            {value.map((seed) => (
              <li
                key={`${seed.type}:${seed.qlooId}`}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 py-1 pl-3.5 pr-1.5 backdrop-blur-md"
              >
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  {SEED_TYPE_LABEL[seed.type]}
                </span>
                <span className="text-xs font-semibold text-zinc-100">{seed.name}</span>
                <button
                  type="button"
                  onClick={() => removeSeed(seed.qlooId)}
                  aria-label={`Remove ${seed.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/[0.1] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
