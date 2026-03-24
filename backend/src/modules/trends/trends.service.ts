import { aiClient } from "../ai/ai.client.js";
import { buildTrendPrompt, trendSystemPrompt } from "../ai/prompts/trend.prompt.js";
import type { TrendReport, WorkflowContext } from "../analyze/analyze.types.js";

import { trendsProvider } from "./trends.provider.js";
import { trendsScorer } from "./trends.scorer.js";

class TrendsService {
  async analyze(context: WorkflowContext): Promise<TrendReport> {
    const signals = await trendsProvider.fetchSignals(context);
    const breakdown = trendsScorer.score(signals);
    const status = trendsScorer.classify(breakdown.total);
    const relatedKeywords = [
      ...signals.relatedQueries.map((item) => item.term),
      ...signals.relatedTopics.map((item) => item.term),
    ].slice(0, 10);
    const fallbackAngles = [
      `Frame ${context.input.topic} around a current pain point for ${context.input.targetAudience}`,
      `Localize the message for ${context.input.region} using fresh market context`,
      relatedKeywords[0]
        ? `Use "${relatedKeywords[0]}" as a supporting keyword angle`
        : `Lead with a practical hook tied to ${context.input.campaignGoal}`,
    ];
    const fallbackExplanation = `Trend score ${breakdown.total}/100 based on short-term momentum (${Math.round(
      breakdown.shortTermMomentum,
    )}), medium-term momentum (${Math.round(breakdown.mediumTermMomentum)}), related query strength (${Math.round(
      breakdown.relatedQueries,
    )}), freshness (${Math.round(breakdown.freshness)}), and region match (${Math.round(
      breakdown.regionMatch,
    )}). Data source: ${signals.source}.`;
    const aiSummary = await aiClient.generateJson({
      taskName: "trend-analysis",
      systemPrompt: trendSystemPrompt,
      userPrompt: buildTrendPrompt(context, signals, breakdown),
      fallback: {
        recommendedAngles: fallbackAngles,
        explanation: fallbackExplanation,
      },
    });

    return {
      status,
      score: breakdown.total,
      urgency: this.resolveUrgency(status),
      relatedKeywords,
      recommendedAngles: aiSummary.recommendedAngles,
      explanation: aiSummary.explanation,
    };
  }

  private resolveUrgency(status: TrendReport["status"]) {
    if (status === "rising") {
      return "post within 48 hours";
    }

    if (status === "good-opportunity") {
      return "publish within 3 to 5 days";
    }

    if (status === "evergreen") {
      return "schedule within this campaign cycle";
    }

    return "test with a low-risk post before committing";
  }
}

export const trendsService = new TrendsService();
