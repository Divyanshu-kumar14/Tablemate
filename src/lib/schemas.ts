import { z } from "zod";

export const seedTypeSchema = z.enum(["artist", "movie", "tv", "restaurant", "cuisine"]);
export const textureSchema = z.enum(["regular", "soft", "very-soft"]);
export const sodiumSchema = z.enum(["no-preference", "lower"]);
export const noiseSchema = z.enum(["quiet", "moderate", "lively"]);
export const dietSchema = z.enum(["diabetic-friendly", "renal-friendly", "gluten-free"]);
export const mobilitySchema = z.enum([
  "step-free",
  "wheelchair",
  "hearing-friendly",
  "low-vision-friendly",
]);

export const tasteSeedSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    type: seedTypeSchema,
    qlooId: z.string().trim().min(1).max(200),
  })
  .strict();

const noteSchema = z
  .string()
  .max(200)
  .transform((value) => value.replace(/[\u0000-\u001f\u007f]/g, " ").trim())
  .refine((value) => value.length <= 200, "Note is too long");

export const needsSchema = z
  .object({
    texture: textureSchema,
    sodium: sodiumSchema,
    diet: z.array(dietSchema).max(3).default([]),
    noise: noiseSchema.optional(),
    mobility: z.array(mobilitySchema).max(4).default([]),
    note: noteSchema.optional(),
  })
  .strict();

export const recommendRequestSchema = z
  .object({
    location: z.string().trim().min(1).max(80),
    taste: z.array(tasteSeedSchema).min(1).max(5),
    needs: needsSchema,
    limit: z.number().int().min(3).max(5).default(5),
  })
  .strict();

export const searchQuerySchema = z
  .object({
    q: z.string().trim().min(1).max(60),
    type: seedTypeSchema.optional(),
  })
  .strict();

export type RecommendRequest = z.infer<typeof recommendRequestSchema>;
export type SearchQuery = z.infer<typeof searchQuerySchema>;

export function validationDetails(error: z.ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "body",
    message: issue.message,
    code: issue.code,
  }));
}
