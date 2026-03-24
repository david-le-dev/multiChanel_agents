import type { ContentInput } from "../../analyze/analyze.types.js";

export const contentSystemPrompt = `
You generate platform-native marketing content.
Avoid repetition, keep hooks strong, and return JSON only.
Every field value must be plain text strings only.
Do not return nested objects for posts, scripts, captions, or thread items.
`.trim();

export const buildContentPrompt = (input: ContentInput) => `
Campaign input:
${JSON.stringify(
  {
    topic: input.input.topic,
    audience: input.input.targetAudience,
    campaignGoal: input.input.campaignGoal,
    selectedChannels: input.input.selectedChannels,
    trendReport: input.trendReport,
    brandVoice: input.brandVoice,
    strategy: input.strategy,
  },
  null,
  2,
)}

Return JSON:
{
  "tiktokScript": "",
  "facebookPosts": ["", "", ""],
  "instagramCaption": "",
  "twitterThread": ["", "", "", ""]
}

Rules:
- Each array item must be a string.
- Do not wrap individual posts in objects like {"hook": "...", "body": "..."}.
- Do not return a top-level "contentPack" object around this payload.
`.trim();
