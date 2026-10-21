"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";
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
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Taste type">
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setType(option.value)}
            aria-pressed={type === option.value}
            className={cn(
              "inline-flex min-h-[48px] items-center rounded-full border px-4 text-[0.95rem] font-semibold transition",
              type === option.value
                ? "border-teal bg-teal text-white"
                : "border-line bg-white text-muted hover:border-teal/40 hover:text-ink",
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
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
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
                ? "Remove a signal to search again"
                : `Search ${SEED_TYPE_LABEL[type].toLowerCase()}s…`
            }
            className="field !pl-12"
            autoComplete="off"
            aria-describedby="taste-help"
            aria-busy={status === "loading"}
          />
          {status === "loading" && (
            <Loader2
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-teal"
              aria-hidden="true"
            />
          )}
        </div>
        <p id="taste-help" className="helper">
          Add 1–5 signals. Two or three gives Qloo more to work with.{" "}
          {full ? "Maximum reached — remove one to change it." : `${value.length} of ${max} added.`}
        </p>

        {status === "error" && (
          <p
            role="alert"
            className="mt-2 rounded-lg border border-amber/30 bg-amber-light/60 p-3 text-[0.9rem] text-ink"
          >
            Search is unavailable right now. Try a cuisine, or start with a persona.
          </p>
        )}

        {open && status !== "error" && (
          <div className="mt-2 rounded-xl border border-line bg-white p-2 shadow-card">
            {status === "loading" && results.length === 0 ? (
              <p className="flex items-center gap-2 px-3 py-3 text-[0.95rem] text-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Searching…
              </p>
            ) : results.length === 0 ? (
              <p className="px-3 py-3 text-[0.95rem] text-muted">
                No matches. Try a different spelling, or choose a cuisine.
              </p>
            ) : (
              <ul className="divide-y divide-line/60" aria-label="Search results">
                {results.map((result) => {
                  const selected = value.some((seed) => seed.qlooId === result.qlooId);
                  return (
                    <li key={`${result.type}:${result.qlooId}`}>
                      <button
                        type="button"
                        onClick={() => addResult(result)}
                        disabled={selected || full}
                        className="flex min-h-[56px] w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-teal-light/40 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <span>
                          <span className="block text-[1rem] font-semibold">{result.name}</span>
                          <span className="block text-[0.85rem] text-muted">
                            {result.subtitle ?? SEED_TYPE_LABEL[result.type]}
                          </span>
                        </span>
                        <span className="flex items-center gap-1 text-[0.85rem] font-semibold text-teal">
                          {selected ? (
                            "Added"
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

      <div className="mt-4">
        <p className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-muted">
          Try one
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example.label}
              type="button"
              onClick={() => {
                setType(example.type);
                setQuery(example.query);
              }}
              className="inline-flex min-h-[44px] items-center rounded-full border border-line bg-paper px-3 text-[0.9rem] font-semibold text-muted transition hover:border-teal/40 hover:text-teal"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[0.85rem] font-semibold uppercase tracking-[0.12em] text-muted">
          Selected
        </p>
        {value.length === 0 ? (
          <p className="mt-2 text-[0.95rem] text-muted">
            Nothing yet. Add an artist, film, show, restaurant, or cuisine.
          </p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Selected taste signals">
            {value.map((seed) => (
              <li
                key={`${seed.type}:${seed.qlooId}`}
                className="flex min-h-[48px] items-center gap-2 rounded-full border border-teal/25 bg-teal-light/45 py-1 pl-3 pr-1"
              >
                <span className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-teal-dark">
                  {SEED_TYPE_LABEL[seed.type]}
                </span>
                <span className="text-[0.95rem] font-semibold text-ink">{seed.name}</span>
                <button
                  type="button"
                  onClick={() => removeSeed(seed.qlooId)}
                  aria-label={`Remove ${seed.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-teal-dark transition hover:bg-white/70"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
