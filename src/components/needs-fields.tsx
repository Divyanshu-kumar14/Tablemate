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
        "flex min-h-[78px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
        checked
          ? "border-teal bg-teal-light/45 ring-1 ring-teal"
          : "border-line bg-white hover:border-teal/40",
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
        className="mt-1 h-5 w-5 shrink-0"
      />
      <span>
        <span className="block text-[1.05rem] font-semibold leading-snug">{label}</span>
        <span className="mt-1 block text-[0.9rem] leading-snug text-muted">{description}</span>
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
        "flex min-h-[78px] cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
        checked
          ? "border-teal bg-teal-light/45 ring-1 ring-teal"
          : "border-line bg-white hover:border-teal/40",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-1 h-5 w-5 shrink-0"
      />
      <span>
        <span className="block text-[1.05rem] font-semibold leading-snug">{label}</span>
        <span className="mt-1 block text-[0.9rem] leading-snug text-muted">{description}</span>
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
      <fieldset>
        <legend className="label-lg">Texture</legend>
        <p className="helper">How easy is it to chew and swallow?</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <RadioCard
            name="texture"
            value="regular"
            checked={texture === "regular"}
            onSelect={onTexture}
            label="Regular"
            description="No texture change needed."
          />
          <RadioCard
            name="texture"
            value="soft"
            checked={texture === "soft"}
            onSelect={onTexture}
            label="Soft"
            description="Can be cut with a fork; no tough cuts or hard crusts."
          />
          <RadioCard
            name="texture"
            value="very-soft"
            checked={texture === "very-soft"}
            onSelect={onTexture}
            label="Very soft / puréed"
            description="Texture-modified food. We will always add a preparation question."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-lg">Sodium</legend>
        <p className="helper">Restaurants can often put sauces and seasoning on the side.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioCard
            name="sodium"
            value="no-preference"
            checked={sodium === "no-preference"}
            onSelect={onSodium}
            label="No preference"
            description="Leave sodium out of the fit score."
          />
          <RadioCard
            name="sodium"
            value="lower"
            checked={sodium === "lower"}
            onSelect={onSodium}
            label="Lower sodium"
            description="Prefer kitchens that can reduce salt or serve sauces separately."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-lg">Diet</legend>
        <p className="helper">Choose any that apply. We label cuisine-level inference as likely, never reported.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <CheckCard
            checked={diet.includes("diabetic-friendly")}
            onToggle={() => onDiet(toggle(diet, "diabetic-friendly"))}
            label="Diabetic-friendly"
            description="Ask about added sugar and portion size."
          />
          <CheckCard
            checked={diet.includes("renal-friendly")}
            onToggle={() => onDiet(toggle(diet, "renal-friendly"))}
            label="Renal-friendly"
            description="Ask for sodium, potassium, and phosphorus information."
          />
          <CheckCard
            checked={diet.includes("gluten-free")}
            onToggle={() => onDiet(toggle(diet, "gluten-free"))}
            label="Gluten-free"
            description="Ask about preparation and cross-contact."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-lg">Noise</legend>
        <p className="helper">Hearing aids and conversation change what a good room feels like.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioCard
            name="noise"
            value="none"
            checked={noise === "none"}
            onSelect={onNoise}
            label="No preference"
            description="Leave noise out of the fit score."
          />
          <RadioCard
            name="noise"
            value="quiet"
            checked={noise === "quiet"}
            onSelect={onNoise}
            label="Quiet"
            description="Prefer a calm room or a quieter table."
          />
          <RadioCard
            name="noise"
            value="moderate"
            checked={noise === "moderate"}
            onSelect={onNoise}
            label="Moderate"
            description="Some life in the room is fine."
          />
          <RadioCard
            name="noise"
            value="lively"
            checked={noise === "lively"}
            onSelect={onNoise}
            label="Lively"
            description="Prefer a busy, animated room."
          />
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-lg">Access and mobility</legend>
        <p className="helper">We only mark this reported when a venue tag states it. Otherwise it is an ask.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <CheckCard
            checked={mobility.includes("step-free")}
            onToggle={() => onMobility(toggle(mobility, "step-free"))}
            label="Step-free entrance"
            description="No stairs at the entrance."
          />
          <CheckCard
            checked={mobility.includes("wheelchair")}
            onToggle={() => onMobility(toggle(mobility, "wheelchair"))}
            label="Wheelchair access"
            description="Entrance and restroom access."
          />
          <CheckCard
            checked={mobility.includes("hearing-friendly")}
            onToggle={() => onMobility(toggle(mobility, "hearing-friendly"))}
            label="Hearing-friendly"
            description="A quieter table or hearing support."
          />
          <CheckCard
            checked={mobility.includes("low-vision-friendly")}
            onToggle={() => onMobility(toggle(mobility, "low-vision-friendly"))}
            label="Low-vision friendly"
            description="Large print or read-aloud options."
          />
        </div>
      </fieldset>

      <div>
        <label htmlFor="note" className="label-lg">
          Anything else about their taste?
        </label>
        <p id="note-help" className="helper">
          Taste only, please — no medical details. This note may be sent to the explanation
          model. Max 200 characters.
        </p>
        <textarea
          id="note"
          value={note}
          onChange={(event) => onNote(event.target.value.slice(0, 200))}
          rows={3}
          maxLength={200}
          aria-describedby="note-help note-count"
          placeholder="Example: Dad hates spicy food and loves a quiet corner."
          className="field mt-2 min-h-[110px] py-3"
        />
        <p id="note-count" className="helper text-right">
          {note.length}/200
        </p>
      </div>
    </div>
  );
}
