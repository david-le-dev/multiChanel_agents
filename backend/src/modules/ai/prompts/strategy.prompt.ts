import type { StrategyInput } from "../../analyze/analyze.types.js";

export const strategySystemPrompt = `
You are a marketing strategist.
Build a channel-aware plan from the input, brand voice, and trend data.
Return JSON only.
`.trim();

export const buildStrategyPrompt = (input: StrategyInput) => `
Campaign input:
${JSON.stringify(
  {
    topic: input.input.topic,
    businessType: input.input.businessType,
    targetAudience: input.input.targetAudience,
    campaignGoal: input.input.campaignGoal,
    region: input.input.region,
    brandTone: input.input.brandTone,
    selectedChannels: input.input.selectedChannels,
    sourceSummary: input.sourceInsight?.summary ?? null,
    trendReport: input.trendReport,
    brandVoice: input.brandVoice,
  },
  null,
  2,
)}

Return JSON:
{
  "coreAngle": "",
  "hooks": ["", "", ""],
  "channelStrategy": {
    "TikTok": "",
    "Facebook": "",
    "Instagram": "",
    "X": ""
  }
}
`.trim();

