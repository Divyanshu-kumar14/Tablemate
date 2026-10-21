import { z } from "zod";
import seniorFitData from "@/data/senior-fit.json";

const dietKeys = ["diabetic-friendly", "renal-friendly", "gluten-free"] as const;

export const fitNoteSchema = z.object({
  why: z.string().min(20),
  rationale: z.string().min(10),
});

export const cuisineRuleSchema = z.object({
  display: z.string().min(1),
  texture: fitNoteSchema,
  sodium: fitNoteSchema,
  diet: z
    .record(z.string(), fitNoteSchema)
    .default({})
    .refine(
      (diet) => Object.keys(diet).every((key) => dietKeys.includes(key as (typeof dietKeys)[number])),
      "Unknown diet key in senior-fit.json",
    ),
});

export const seniorFitSchema = z.object({
  version: z.string().min(1),
  updated: z.string().min(1),
  scope: z.string().min(20),
  cuisines: z.record(z.string(), cuisineRuleSchema),
});

export type CuisineRule = z.infer<typeof cuisineRuleSchema>;
export type FitNote = z.infer<typeof fitNoteSchema>;

export const SENIOR_FIT = seniorFitSchema.parse(seniorFitData);

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getCuisineRule(cuisine: string): CuisineRule | null {
  const slug = slugify(cuisine);
  const direct = SENIOR_FIT.cuisines[slug];
  if (direct) return direct;
  return (
    Object.values(SENIOR_FIT.cuisines).find(
      (rule) => slugify(rule.display) === slug || rule.display.toLowerCase() === cuisine.toLowerCase(),
    ) ?? null
  );
}
