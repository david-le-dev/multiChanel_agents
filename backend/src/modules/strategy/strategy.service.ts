import { aiClient } from "../ai/ai.client.js";
import { buildStrategyPrompt, strategySystemPrompt } from "../ai/prompts/strategy.prompt.js";

import type { StrategyInput, StrategyPlan } from "../analyze/analyze.types.js";

class StrategyService {
  async build(input: StrategyInput): Promise<StrategyPlan> {
    const channelStrategy = Object.fromEntries(
      input.input.selectedChannels.map((channel) => [
        channel,
        `Use a ${input.brandVoice.tone} execution for ${channel} with emphasis on ${input.trendReport.status} timing.`,
      ]),
    );

    const fallback: StrategyPlan = {
      coreAngle: `Position ${input.input.topic} as a timely way for ${input.input.targetAudience} to achieve ${input.input.campaignGoal}.`,
      hooks: [
        `Why ${input.input.topic} matters right now`,
        `The practical shift ${input.input.targetAudience} should not ignore`,
        `What ${input.input.region} audiences can do next`,
      ],
      channelStrategy,
    };

    return aiClient.generateJson({
      taskName: "strategy",
      systemPrompt: strategySystemPrompt,
      userPrompt: buildStrategyPrompt(input),
      fallback,
    });
  }
}

export const strategyService = new StrategyService();
