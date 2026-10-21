import { z } from "zod";

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const envSchema = z.object({
  QLOO_API_KEY: optionalString,
  QLOO_BASE_URL: z.string().url().default("https://hackathon.api.qloo.com"),
  QLOO_MOCK: optionalString,
  GEMINI_API_KEY: optionalString,
  GEMINI_MODEL: z
    .string()
    .regex(/^[a-zA-Z0-9._/-]+$/, "Invalid Gemini model id")
    .default("gemini-2.5-flash"),
  GEMINI_MAX_TOKENS: z.coerce.number().int().min(100).max(4000).default(900),
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  DAILY_LLM_BUDGET: z.coerce.number().int().positive().default(150_000),
  NODE_ENV: optionalString,
});

export type AppEnv = z.infer<typeof envSchema>;

function loadEnv(): AppEnv {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const problems = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${problems}`);
  }
  return parsed.data;
}

export const env = loadEnv();

export const isMockMode = env.QLOO_MOCK === "1" || !env.QLOO_API_KEY;
export const isLlmEnabled = Boolean(env.GEMINI_API_KEY);
export const isUpstashEnabled = Boolean(
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN,
);

export const qlooBaseUrl = env.QLOO_BASE_URL.replace(/\/+$/, "");
