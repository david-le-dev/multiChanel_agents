import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const backendRoot = path.resolve(currentDir, "..", "..");

dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(backendRoot, ".env.local"), override: true });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:3000"),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  AI_PROVIDER: z.enum(["gemini", "mock"]).default("gemini"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  GEMINI_API_KEY: z.string().optional(),
  TREND_PROVIDER: z.enum(["serpapi", "mock"]).default("mock"),
  SERPAPI_API_KEY: z.string().optional(),
  SERPAPI_TRENDS_TIMEFRAME: z.string().default("today 3-m"),
});

const normalizeOptionalEnv = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

export const env = envSchema.parse({
  ...process.env,
  GEMINI_API_KEY: normalizeOptionalEnv(process.env.GEMINI_API_KEY),
  SERPAPI_API_KEY: normalizeOptionalEnv(process.env.SERPAPI_API_KEY),
});

export const isProduction = env.NODE_ENV === "production";
