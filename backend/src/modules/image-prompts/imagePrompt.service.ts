import { aiClient } from "../ai/ai.client.js";
import {
  buildImagePromptPrompt,
  imagePromptSystemPrompt,
} from "../ai/prompts/imagePrompt.prompt.js";

import type { ImagePromptInput, ImagePromptSet } from "../analyze/analyze.types.js";

class ImagePromptService {
  async generate(input: ImagePromptInput): Promise<ImagePromptSet[]> {
    const fallback: ImagePromptSet[] = [
      {
        type: "hero",
        prompt: `Create a polished hero image for ${input.input.topic} with a ${input.input.brandTone} brand tone and editorial composition.`,
      },
      {
        type: "product-service",
        prompt: `Visualize ${input.input.businessType} solving a real customer problem tied to ${input.strategy.coreAngle}.`,
      },
      {
        type: "social",
        prompt: `Design a bold social media visual for ${input.input.topic} optimized for attention in fast-moving feeds.`,
      },
    ];

    return aiClient.generateJson({
      taskName: "image-prompts",
      systemPrompt: imagePromptSystemPrompt,
      userPrompt: buildImagePromptPrompt(input),
      fallback,
    });
  }
}

export const imagePromptService = new ImagePromptService();
