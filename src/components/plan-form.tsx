"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
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
      setError("Add at least one taste signal and a city or neighborhood.");
      return;
    }

    saveDraft(parsed.data);
    router.push("/results");
  }

  return (
    <>
      <section className="border-b border-line/70 bg-paper/40">
        <div className="container-page py-9 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-muted transition hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Home
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow">Build a shortlist</p>
              <h1 className="mt-3 font-display text-[2.7rem] font-semibold leading-[1.03] sm:text-[3.6rem]">
                Who are we cooking for?
              </h1>
              <p className="mt-4 max-w-2xl text-[1.08rem] leading-relaxed text-muted">
                Start with what they love. Then tell us what makes eating hard. We will find
                five places and write the questions to ask before you book.
              </p>
            </div>
            <p className="chip w-fit">About 2 minutes</p>
          </div>

          {persona && (
            <div className="mt-6 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-teal/25 bg-teal-light/40 p-4">
              <p className="flex items-start gap-2 text-[0.95rem] leading-relaxed">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                <span>
                  Starting from <strong className="font-semibold">{persona.name}&apos;s</strong>{" "}
                  profile. Edit anything.
                </span>
              </p>
              <button
                type="button"
                onClick={clearProfile}
                className="text-[0.9rem] font-semibold text-teal underline decoration-teal/40 decoration-2 underline-offset-4 hover:decoration-teal"
              >
                Clear profile
              </button>
            </div>
          )}
        </div>
      </section>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start"
      >
        <div className="space-y-6">
          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-teal-light font-display text-lg text-teal-dark"
                aria-hidden="true"
              >
                01
              </span>
              <div>
                <h2 className="font-display text-[1.8rem] font-semibold leading-tight">Taste</h2>
                <p className="mt-1 text-[1rem] text-muted">
                  What do they love? Music, film, a cuisine, a place they return to.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <TasteInput value={taste} onChange={setTaste} />
            </div>
          </section>

          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-teal-light font-display text-lg text-teal-dark"
                aria-hidden="true"
              >
                02
              </span>
              <div>
                <h2 className="font-display text-[1.8rem] font-semibold leading-tight">Needs</h2>
                <p className="mt-1 text-[1rem] text-muted">
                  Texture, sodium, diet, noise, and access. These are applied as evidence
                  labels, not guesses dressed up as facts.
                </p>
              </div>
            </div>
            <div className="mt-7">
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

          <section className="card-paper p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-teal/20 bg-teal-light font-display text-lg text-teal-dark"
                aria-hidden="true"
              >
                03
              </span>
              <div>
                <h2 className="font-display text-[1.8rem] font-semibold leading-tight">
                  Location
                </h2>
                <p className="mt-1 text-[1rem] text-muted">
                  A city or neighborhood. This is a hard filter.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <label htmlFor="location" className="label-lg">
                City or neighborhood
              </label>
              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                className="field mt-2"
                placeholder="Brooklyn, NY"
                autoComplete="address-level2"
                aria-describedby="location-help"
                required
              />
              <p id="location-help" className="helper">
                Sample mode covers Brooklyn, Edison, and Chicago. Add a Qloo key for live
                coverage anywhere Qloo has venues.
              </p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-paper p-6">
            <h2 className="font-display text-[1.7rem] font-semibold">Your shortlist</h2>

            <div className="mt-4 space-y-4">
              <div>
                <p className="eyebrow">Taste</p>
                {taste.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {taste.map((seed) => (
                      <li
                        key={`${seed.type}:${seed.qlooId}`}
                        className="flex items-baseline justify-between gap-3 text-[0.95rem]"
                      >
                        <span className="font-semibold">{seed.name}</span>
                        <span className="shrink-0 text-[0.75rem] uppercase tracking-[0.1em] text-muted">
                          {SEED_TYPE_LABEL[seed.type]}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-[0.9rem] text-muted">Add at least one.</p>
                )}
              </div>

              <div>
                <p className="eyebrow">Needs</p>
                {summary.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {summary.map((need) => (
                      <span key={need} className="chip">
                        {need}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-[0.9rem] text-muted">No extra needs selected.</p>
                )}
              </div>

              <div>
                <p className="eyebrow">Where</p>
                <p className="mt-1 text-[0.95rem] font-semibold">
                  {location.trim() || "Add a location"}
                </p>
              </div>
            </div>

            <button type="submit" disabled={!canSubmit} className="btn-primary mt-6 w-full">
              Find 5 places
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            {!canSubmit && (
              <p className="helper">Add a taste signal and a location to continue.</p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 text-[0.9rem] text-red-900"
              >
                {error}
              </p>
            )}

            <p className="mt-4 border-t border-line/70 pt-4 text-[0.9rem] leading-relaxed text-muted">
              Taste signals and venue facts go to Qloo. The optional explanation model sees taste
              and venue facts, not your structured health needs. Please keep medical details out
              of the free-text note.
            </p>
          </div>

          <div className="mt-4">
            <Disclaimer compact />
          </div>
        </aside>
      </form>
    </>
  );
}
