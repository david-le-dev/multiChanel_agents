import { aiClient } from "../ai/ai.client.js";
import { buildContentPrompt, contentSystemPrompt } from "../ai/prompts/content.prompt.js";

import type { ContentInput, ContentPack } from "../analyze/analyze.types.js";

class ContentService {
  async generate(input: ContentInput): Promise<ContentPack> {
    const fallback: ContentPack = {
      tiktokScript: `Hook: ${input.strategy.hooks[0]}. Body: Explain ${input.input.topic} for ${input.input.targetAudience}. Close with a CTA tied to ${input.input.campaignGoal}. Tone: ${input.brandVoice.tone}.`,
      facebookPosts: [
        `Post 1: Introduce ${input.input.topic} with a practical insight.`,
        `Post 2: Reframe the trend around audience value.`,
        `Post 3: Close with a clear CTA tied to ${input.input.campaignGoal}.`,
      ],
      instagramCaption: `${input.strategy.hooks[1]}\n\nA concise visual-first caption about ${input.input.topic}.\n\nCTA: ${input.input.campaignGoal}`,
      twitterThread: [
        `1. ${input.strategy.hooks[0]}`,
        `2. ${input.input.topic} is becoming relevant for ${input.input.targetAudience}.`,
        `3. Here is the strategic angle: ${input.strategy.coreAngle}`,
        `4. CTA: ${input.input.campaignGoal}`,
      ],
    };

    const rawContent = await aiClient.generateJson<unknown>({
      taskName: "content",
      systemPrompt: contentSystemPrompt,
      userPrompt: buildContentPrompt(input),
      fallback,
      timeoutMs: 30000,
      retryCount: 1,
    });

    return normalizeContentPack(rawContent, fallback);
  }
}

export const contentService = new ContentService();

const normalizeContentPack = (value: unknown, fallback: ContentPack): ContentPack => {
  const candidate = isRecord(value) && isRecord(value.contentPack) ? value.contentPack : value;
  const source = isRecord(candidate) ? candidate : {};

  return {
    tiktokScript: coerceText(
      source.tiktokScript ?? source.tikTokScript ?? source.tiktok ?? source.tiktok_reel_script,
      fallback.tiktokScript,
    ),
    facebookPosts: coerceTextArray(source.facebookPosts ?? source.facebook ?? source.facebook_posts, fallback.facebookPosts),
    instagramCaption: coerceText(
      source.instagramCaption ?? source.instagram ?? source.instagram_caption,
      fallback.instagramCaption,
    ),
    twitterThread: coerceTextArray(
      source.twitterThread ?? source.xThread ?? source.x ?? source.twitter ?? source.thread,
      fallback.twitterThread,
    ),
  };
};

const coerceTextArray = (value: unknown, fallback: string[]) => {
  if (Array.isArray(value)) {
    const items = value.map((item) => coerceText(item, "")).filter(Boolean);
    return items.length > 0 ? items : fallback;
  }

  const text = coerceText(value, "");
  if (!text) {
    return fallback;
  }

  const items = text
    .split(/\n{2,}|\n(?=\d+\.)/)
    .map((item) => item.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
};

const coerceText = (value: unknown, fallback: string) => {
  const text = flattenText(value).trim();
  return text || fallback;
};

const flattenText = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => flattenText(item)).filter(Boolean).join("\n");
  }

  if (isRecord(value)) {
    const preferredOrder = ["hook", "headline", "caption", "body", "script", "cta", "text"];
    const orderedValues = [
      ...preferredOrder.map((key) => value[key]),
      ...Object.entries(value)
        .filter(([key]) => !preferredOrder.includes(key))
        .map(([, item]) => item),
    ];

    return orderedValues.map((item) => flattenText(item)).filter(Boolean).join("\n");
  }

  return "";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;
