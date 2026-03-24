import type { ImagePromptInput } from "../../analyze/analyze.types.js";

export const imagePromptSystemPrompt = `
You create polished image prompts for marketing campaigns.
Return JSON only.
`.trim();

export const buildImagePromptPrompt = (input: ImagePromptInput) => `
Campaign input:
${JSON.stringify(
  {
    topic: input.input.topic,
    businessType: input.input.businessType,
    targetAudience: input.input.targetAudience,
    brandTone: input.input.brandTone,
    strategy: input.strategy,
    trendReport: input.trendReport,
    brandVoice: input.brandVoice,
  },
  null,
  2,
)}

Return JSON:
[
  { "type": "hero", "prompt": "" },
  { "type": "product-service", "prompt": "" },
  { "type": "social", "prompt": "" }
]
`.trim();

