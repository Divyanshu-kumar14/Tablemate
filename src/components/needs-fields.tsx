"use client";

import type { Diet, Mobility, Noise, Sodium, Texture } from "@/types/domain";
import { cn } from "@/lib/cn";

function toggle<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function RadioCard<T extends string>({
  name,
  value,
  checked,
  onSelect,
  label,
  description,
}: {
  name: string;
  value: T;
  checked: boolean;
  onSelect: (value: T) => void;
  label: string;
  description: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-[76px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200",
        checked
          ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.12)] ring-1 ring-amber-400/30"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
      />
      <span>
        <span className={cn("block text-sm font-semibold leading-snug", checked ? "text-amber-300" : "text-zinc-100")}>
          {label}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-zinc-400">{description}</span>
      </span>
    </label>
  );
}

function CheckCard({
  checked,
  onToggle,
  label,
  description,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}) {
  return (
    <label
      className={cn(
        "flex min-h-[76px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200",
        checked
          ? "border-amber-400/60 bg-amber-500/10 shadow-[0_0_25px_rgba(245,158,11,0.12)] ring-1 ring-amber-400/30"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] hover:bg-white/[0.04]",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-4 w-4 shrink-0 accent-amber-400"
      />
      <span>
        <span className={cn("block text-sm font-semibold leading-snug", checked ? "text-amber-300" : "text-zinc-100")}>
          {label}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-zinc-400">{description}</span>
      </span>
    </label>
  );
}

export function NeedsFields({
  texture,
  onTexture,
  sodium,
  onSodium,
  diet,
  onDiet,
  noise,
  onNoise,
  mobility,
  onMobility,
  note,
  onNote,
}: {
  texture: Texture;
  onTexture: (value: Texture) => void;
  sodium: Sodium;
  onSodium: (value: Sodium) => void;
  diet: Diet[];
  onDiet: (value: Diet[]) => void;
  noise: Noise | "none";
  onNoise: (value: Noise | "none") => void;
  mobility: Mobility[];
  onMobility: (value: Mobility[]) => void;
  note: string;
  onNote: (value: string) => void;
}) {
  return (
    <div className="space-y-8">
      {/* Texture */}
      <fieldset>
        <legend className="label-lg">Food Texture</legend>
        <p className="helper">How soft does food need to be?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <RadioCard
            name="texture"
            value="regular"
            checked={texture === "regular"}
            onSelect={onTexture}
            label="Regular"
            description="No chewing or swallowing restrictions."
          />
          <RadioCard
            name="texture"
            value="soft"
            checked={texture === "soft"}
            onSelect={onTexture}
            label="Soft"
            description="Easy to cut with a fork; tender meats, soft pasta."
          />
          <RadioCard
            name="texture"
            value="very-soft"
            checked={texture === "very-soft"}
            onSelect={onTexture}
            label="Very Soft / Puréed"
            description="Smooth or puréed foods; calls for verification."
          />
        </div>
      </fieldset>

      {/* Sodium */}
      <fieldset>
        <legend className="label-lg">Sodium Intake</legend>
        <p className="helper">Relevant for hypertension, kidney, or heart conditions.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioCard
            name="sodium"
            value="no-preference"
            checked={sodium === "no-preference"}
            onSelect={onSodium}
            label="No restriction"
            description="Standard kitchen seasoning."
          />
          <RadioCard
            name="sodium"
            value="lower"
            checked={sodium === "lower"}
            onSelect={onSodium}
            label="Lower Sodium"
            description="Look for kitchens that can prepare dishes with less added salt."
          />
        </div>
      </fieldset>

      {/* Dietary */}
      <fieldset>
        <legend className="label-lg">Dietary Patterns</legend>
        <p className="helper">Select any chronic dietary needs.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <CheckCard
            checked={diet.includes("diabetic-friendly")}
            onToggle={() => onDiet(toggle(diet, "diabetic-friendly"))}
            label="Diabetic-friendly"
            description="Lower simple carbs, lean proteins."
          />
          <CheckCard
            checked={diet.includes("renal-friendly")}
            onToggle={() => onDiet(toggle(diet, "renal-friendly"))}
            label="Renal-friendly"
            description="Lower phosphorus and potassium options."
          />
          <CheckCard
            checked={diet.includes("gluten-free")}
            onToggle={() => onDiet(toggle(diet, "gluten-free"))}
            label="Gluten-free"
            description="Options prepared without wheat or gluten."
          />
        </div>
      </fieldset>

      {/* Noise / Ambiance */}
      <fieldset>
        <legend className="label-lg">Noise & Acoustics</legend>
        <p className="helper">Critical for hearing aids and comfortable conversation.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <RadioCard
            name="noise"
            value="quiet"
            checked={noise === "quiet"}
            onSelect={onNoise}
            label="Quiet & Calm"
            description="Soft acoustics, minimal background music."
          />
          <RadioCard
            name="noise"
            value="moderate"
            checked={noise === "moderate"}
            onSelect={onNoise}
            label="Moderate"
            description="Conversational atmosphere."
          />
          <RadioCard
            name="noise"
            value="none"
            checked={noise === "none"}
            onSelect={onNoise}
            label="No preference"
            description="Any ambient sound level."
          />
        </div>
      </fieldset>

      {/* Mobility & Accessibility */}
      <fieldset>
        <legend className="label-lg">Physical Accessibility</legend>
        <p className="helper">Entrance and seating logistics.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <CheckCard
            checked={mobility.includes("step-free")}
            onToggle={() => onMobility(toggle(mobility, "step-free"))}
            label="Step-free Entrance"
            description="No stairs or steps at the main entrance."
          />
          <CheckCard
            checked={mobility.includes("wheelchair")}
            onToggle={() => onMobility(toggle(mobility, "wheelchair"))}
            label="Wheelchair Accessible"
            description="Accessible entrance and restroom clearance."
          />
        </div>
      </fieldset>

      {/* Free-text note */}
      <div>
        <label htmlFor="plan-note" className="label-lg">
          Optional Family Note
        </label>
        <p className="helper">
          Soft preferences only (e.g. &ldquo;Dad dislikes spicy food&rdquo;). Avoid confidential medical information.
        </p>
        <textarea
          id="plan-note"
          value={note}
          onChange={(e) => onNote(e.target.value)}
          rows={3}
          maxLength={200}
          placeholder="e.g. Loves a booth by the window, prefers mild flavors..."
          className="field mt-2.5 h-auto py-3 text-sm"
        />
        <div className="mt-1.5 flex justify-end">
          <span className="font-mono text-[11px] text-zinc-500">{note.length}/200</span>
        </div>
      </div>
    </div>
  );
}
