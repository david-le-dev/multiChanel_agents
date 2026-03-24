import { env } from "../../config/env.js";
import { safeJsonParse } from "../../shared/utils.js";

interface GenerateJsonParams<T> {
  taskName: string;
  systemPrompt: string;
  userPrompt: string;
  fallback: T;
  timeoutMs?: number;
  retryCount?: number;
}

class AiClient {
  async generateJson<T>(params: GenerateJsonParams<T>): Promise<T> {
    if (env.AI_PROVIDER === "mock") {
      return params.fallback;
    }

    try {
      const raw = await this.generateWithRetry(params);
      const parsed = safeJsonParse<T>(extractJson(raw));

      return parsed ?? params.fallback;
    } catch (error) {
      console.warn(`AI generation fell back for ${params.taskName}`, error);
      return params.fallback;
    }
  }

  private async generateWithRetry<T>(params: GenerateJsonParams<T>) {
    const attempts = (params.retryCount ?? 0) + 1;
    let lastError: unknown;

    for (let attempt = 1; attempt <= attempts; attempt += 1) {
      try {
        return await this.generateWithGemini(
          params.systemPrompt,
          params.userPrompt,
          params.timeoutMs ?? env.REQUEST_TIMEOUT_MS,
        );
      } catch (error) {
        lastError = error;
        if (attempt >= attempts || !isRetryableError(error)) {
          break;
        }
      }
    }

    throw lastError;
  }

  private async generateWithGemini(systemPrompt: string, userPrompt: string, timeoutMs: number) {
    if (!env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userPrompt }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const candidates = Array.isArray(payload.candidates)
      ? (payload.candidates as Array<Record<string, unknown>>)
      : [];
    const chunks: string[] = [];
    for (const candidate of candidates) {
      const content = candidate.content as Record<string, unknown> | undefined;
      const parts = Array.isArray(content?.parts)
        ? (content.parts as Array<Record<string, unknown>>)
        : [];
      for (const part of parts) {
        if (typeof part.text === "string" && part.text.trim()) {
          chunks.push(part.text);
        }
      }
    }
    const text = chunks.join("\n").trim();

    if (!text) {
      throw new Error("Gemini response did not include text output");
    }

    return text;
  }
}

const isRetryableError = (error: unknown) => {
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return true;
  }

  return error instanceof Error && /timeout|429|5\d\d/i.test(error.message);
};

const extractJson = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return trimmed;
  }

  const match = trimmed.match(/```json\s*([\s\S]*?)```/i) ?? trimmed.match(/({[\s\S]*}|\[[\s\S]*\])/);
  return match?.[1] ?? match?.[0] ?? trimmed;
};

export const aiClient = new AiClient();
