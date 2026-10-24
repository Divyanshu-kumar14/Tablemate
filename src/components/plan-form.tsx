"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, Sparkles, MapPin } from "lucide-react";
import type { Diet, Mobility, Noise, Sodium, TasteSeed, Texture } from "@/types/domain";
import { getPersona } from "@/data/personas";
import { recommendRequestSchema } from "@/lib/schemas";
import { needsSummary, SEED_TYPE_LABEL } from "@/lib/labels";
import { loadDraft, saveDraft } from "@/lib/client/draft";
import { TasteInput } from "@/components/taste-input";
import { NeedsFields } from "@/components/needs-fields";
import { Disclaimer } from "@/components/disclaimer";

export function PlanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const persona = getPersona(searchParams.get("persona"));

  const [taste, setTaste] = useState<TasteSeed[]>([]);
  const [location, setLocation] = useState("");
  const [texture, setTexture] = useState<Texture>("regular");
  const [sodium, setSodium] = useState<Sodium>("no-preference");
  const [diet, setDiet] = useState<Diet[]>([]);
  const [noise, setNoise] = useState<Noise | "none">("none");
  const [mobility, setMobility] = useState<Mobility[]>([]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (persona) {
      setTaste(persona.taste.map((seed) => ({ ...seed })));
      setLocation(persona.location);
      setTexture(persona.needs.texture);
      setSodium(persona.needs.sodium);
      setDiet([...persona.needs.diet]);
      setNoise(persona.needs.noise ?? "none");
      setMobility([...persona.needs.mobility]);
      setNote(persona.needs.note ?? "");
      return;
    }

    const draft = loadDraft();
    if (draft) {
      setTaste(draft.taste);
      setLocation(draft.location);
      setTexture(draft.needs.texture);
      setSodium(draft.needs.sodium);
      setDiet(draft.needs.diet);
      setNoise(draft.needs.noise ?? "none");
      setMobility(draft.needs.mobility);
      setNote(draft.needs.note ?? "");
    }
  }, [persona]);

  const summary = needsSummary({
    texture,
    sodium,
    diet,
    noise: noise === "none" ? undefined : noise,
    mobility,
    note: note.trim() || undefined,
  });

  const canSubmit = taste.length > 0 && location.trim().length > 0;

  function clearProfile() {
    setTaste([]);
    setLocation("");
    setTexture("regular");
    setSodium("no-preference");
    setDiet([]);
    setNoise("none");
    setMobility([]);
    setNote("");
    setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = recommendRequestSchema.safeParse({
      location: location.trim(),
      taste,
      needs: {
        texture,
        sodium,
        diet,
        ...(noise !== "none" ? { noise } : {}),
        mobility,
        ...(note.trim() ? { note: note.trim() } : {}),
      },
      limit: 5,
    });

    if (!parsed.success) {
      setError("Please add at least one taste signal and specify a target city.");
      return;
    }

    saveDraft(parsed.data);
    router.push("/results");
  }

  return (
    <>
      {/* Header Banner */}
      <section className="border-b border-white/[0.08] bg-obsidian-900/60 backdrop-blur-md">
        <div className="container-page py-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 transition hover:text-zinc-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to Home
          </Link>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Interactive Shortlist Builder</p>
              <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-100">
                Who are we cooking for?
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-300">
                Input their cultural touchstones and physical dining constraints. Our agent queries Qloo&apos;s taste graph, evaluates kitchen texture and sodium realities, and prepares your 30-second verification phone script.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-300">
              <Sparkles className="h-3 w-3" />
              <span>Full Agent Pipeline</span>
            </div>
          </div>

          {persona && (
            <div className="liquid-glass mt-6 flex flex-wrap items-center justify-between gap-3 border-amber-500/30 bg-amber-500/05 p-4">
              <p className="flex items-center gap-2 text-sm text-zinc-200">
                <Info className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <span>
                  Configured from <strong className="font-semibold text-white">{persona.name}&apos;s</strong> baseline profile. You can customize any field.
                </span>
              </p>
              <button
                type="button"
                onClick={clearProfile}
                className="text-xs font-semibold text-amber-400 underline underline-offset-4 hover:text-amber-300"
              >
                Reset to Blank
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Interactive Form Grid */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start w-full min-w-0 max-w-full"
      >
        <div className="space-y-6 min-w-0 max-w-full">
          {/* Step 01: Taste */}
          <section className="card-paper p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 font-mono text-sm font-bold text-amber-400"
                aria-hidden="true"
              >
                01
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
                  Taste
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  What do they love? Music, film, a cuisine, a place they return to.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TasteInput value={taste} onChange={setTaste} />
            </div>
          </section>

          {/* Step 02: Needs */}
          <section className="card-paper p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 font-mono text-sm font-bold text-amber-400"
                aria-hidden="true"
              >
                02
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
                  Needs
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Texture, sodium, diet, noise, and access. These are applied as evidence labels, not guesses dressed up as facts.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <NeedsFields
                texture={texture}
                onTexture={setTexture}
                sodium={sodium}
                onSodium={setSodium}
                diet={diet}
                onDiet={setDiet}
                noise={noise}
                onNoise={setNoise}
                mobility={mobility}
                onMobility={setMobility}
                note={note}
                onNote={setNote}
              />
            </div>
          </section>

          {/* Step 03: Location */}
          <section className="card-paper p-5 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 font-mono text-sm font-bold text-amber-400"
                aria-hidden="true"
              >
                03
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-100">
                  Location
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  A city or neighborhood. This is a hard filter.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="location" className="label-lg">
                City or neighborhood
              </label>
              <div className="relative mt-2">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="field !pl-11"
                  placeholder="Brooklyn, NY"
                  autoComplete="address-level2"
                  aria-describedby="location-help"
                  required
                />
              </div>
              <p id="location-help" className="helper">
                Sample mode covers Brooklyn, Edison, and Chicago. Add a Qloo key for live coverage anywhere Qloo has venues.
              </p>
            </div>
          </section>
        </div>

        {/* Sidebar Summary & Launch */}
        <aside className="lg:sticky lg:top-24 lg:self-start min-w-0 max-w-full">
          <div className="card-paper p-5 sm:p-6">
            <h2 className="font-display text-xl font-bold text-zinc-100">Your shortlist</h2>

            <div className="mt-5 space-y-4">
              <div>
                <p className="eyebrow">Taste</p>
                {taste.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {taste.map((seed) => (
                      <li
                        key={`${seed.type}:${seed.qlooId}`}
                        className="flex items-baseline justify-between gap-3 text-xs"
                      >
                        <span className="font-medium text-zinc-200">{seed.name}</span>
                        <span className="font-mono text-[10px] text-zinc-500 uppercase">
                          {SEED_TYPE_LABEL[seed.type]}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-xs text-zinc-500">Add at least one.</p>
                )}
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <p className="eyebrow">Needs</p>
                {summary.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {summary.map((need) => (
                      <span key={need} className="chip !text-[11px] !py-0.5">
                        {need}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1.5 text-xs text-zinc-500">No extra needs selected.</p>
                )}
              </div>

              <div className="border-t border-white/[0.06] pt-3">
                <p className="eyebrow">Where</p>
                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {location.trim() || "Add a location"}
                </p>
              </div>
            </div>

            <button type="submit" disabled={!canSubmit} className="btn-primary mt-6 w-full !text-base">
              Find 5 places
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            {!canSubmit && (
              <p className="mt-2 text-center text-[11px] text-zinc-500">
                Add at least 1 taste signal and a location to launch.
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-xs text-red-300"
              >
                {error}
              </p>
            )}

            <div className="mt-5 border-t border-white/[0.06] pt-4 text-[11px] leading-relaxed text-zinc-500">
              Personal health constraints remain strictly on your client device and are never stored or logged.
            </div>
          </div>

          <div className="mt-4">
            <Disclaimer compact />
          </div>
        </aside>
      </form>
    </>
  );
}
