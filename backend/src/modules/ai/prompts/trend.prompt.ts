import type { WorkflowContext } from "../../analyze/analyze.types.js";
import type { RawTrendSignal } from "../../trends/trends.provider.js";
import type { TrendScoreBreakdown } from "../../trends/trends.scorer.js";

export const trendSystemPrompt = `
You are a market trend analyst.
Use the supplied external trend signals only.
Return concise JSON with recommendedAngles and explanation.
`.trim();

export const buildTrendPrompt = (
  context: WorkflowContext,
  signals: RawTrendSignal,
  breakdown: TrendScoreBreakdown,
) => `
Topic: ${context.input.topic}
Region: ${context.input.region}
Audience: ${context.input.targetAudience}
Campaign goal: ${context.input.campaignGoal}
Source summary: ${context.sourceInsight?.summary ?? "None"}

Trend signals:
${JSON.stringify(
  {
    interestOverTime: signals.interestOverTime,
    relatedQueries: signals.relatedQueries,
    relatedTopics: signals.relatedTopics,
    regionRelevance: signals.regionRelevance,
    freshness: signals.freshness,
    scoreBreakdown: breakdown,
  },
  null,
  2,
)}

Return JSON:
{
  "recommendedAngles": ["", "", ""],
  "explanation": ""
}
`.trim();

