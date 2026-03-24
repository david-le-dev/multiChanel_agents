import { aiClient } from "../ai/ai.client.js";
import {
  brandVoiceSystemPrompt,
  buildBrandVoicePrompt,
} from "../ai/prompts/brandVoice.prompt.js";

import type { BrandVoiceInput, BrandVoiceProfile } from "../analyze/analyze.types.js";

class BrandVoiceService {
  async analyze(input: BrandVoiceInput): Promise<BrandVoiceProfile> {
    const fallback: BrandVoiceProfile = {
      tone: input.input.brandTone,
      formality: inferFormality(input.input.brandTone),
      sentenceStyle: input.input.selectedChannels.includes("TikTok")
        ? "short, energetic, and hook-driven"
        : "concise and persuasive",
      ctaStyle: inferCtaStyle(input.input.campaignGoal),
      preferredWords: [input.input.businessType, input.input.campaignGoal.split(" ")[0] ?? "results", "clarity"],
      avoidWords: ["disruptive", "revolutionary"],
    };

    return aiClient.generateJson({
      taskName: "brand-voice",
      systemPrompt: brandVoiceSystemPrompt,
      userPrompt: buildBrandVoicePrompt(input),
      fallback,
    });
  }
}

export const brandVoiceService = new BrandVoiceService();

const inferFormality = (tone: string) =>
  /premium|executive|formal|authoritative/i.test(tone) ? "formal" : "balanced";

const inferCtaStyle = (campaignGoal: string) =>
  /signup|subscribe|download/i.test(campaignGoal) ? "value-led and low-friction" : "direct but supportive";
