import type { BrandVoiceInput } from "../../analyze/analyze.types.js";

export const brandVoiceSystemPrompt = `
You analyze marketing context and infer a brand voice profile.
Return JSON only.
`.trim();

export const buildBrandVoicePrompt = (input: BrandVoiceInput) => `
Business type: ${input.input.businessType}
Target audience: ${input.input.targetAudience}
Campaign goal: ${input.input.campaignGoal}
Brand tone: ${input.input.brandTone}
Channels: ${input.input.selectedChannels.join(", ")}
Past brand content:
${input.input.pastBrandContent.join("\n") || "None provided"}

Trend status: ${input.trendReport.status}
Source summary: ${input.sourceInsight?.summary ?? "None"}

Return JSON:
{
  "tone": "",
  "formality": "",
  "sentenceStyle": "",
  "ctaStyle": "",
  "preferredWords": [],
  "avoidWords": []
}
`.trim();

