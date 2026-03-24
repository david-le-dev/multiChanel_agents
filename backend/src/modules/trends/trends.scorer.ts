import { average, clamp } from "../../shared/utils.js";

import type { RawTrendSignal } from "./trends.provider.js";

export interface TrendScoreBreakdown {
  shortTermMomentum: number;
  mediumTermMomentum: number;
  relatedQueries: number;
  freshness: number;
  regionMatch: number;
  total: number;
}

class TrendsScorer {
  score(signal: RawTrendSignal): TrendScoreBreakdown {
    const values = signal.interestOverTime.map((point) => point.value);
    const recentWindow = values.slice(-3);
    const previousWindow = values.slice(Math.max(0, values.length - 6), Math.max(0, values.length - 3));
    const last = values.at(-1) ?? 0;
    const shortTermMomentum = clamp(
      previousWindow.length === 0
        ? last
        : ((average(recentWindow) - average(previousWindow)) + 50),
      0,
      100,
    );
    const mediumTermMomentum = clamp(
      values.length === 0 ? 0 : average(values.slice(-Math.max(2, Math.ceil(values.length / 2)))),
      0,
      100,
    );
    const relatedQueries = clamp(
      average(signal.relatedQueries.slice(0, 5).map((item) => item.value)) || signal.relatedQueries.length * 12,
      0,
      100,
    );
    const freshness = signal.freshness.score;
    const regionMatch = clamp(signal.regionRelevance, 0, 100);

    const total = Math.round(
      shortTermMomentum * 0.35 +
        mediumTermMomentum * 0.25 +
        relatedQueries * 0.15 +
        freshness * 0.15 +
        regionMatch * 0.1,
    );

    return {
      shortTermMomentum,
      mediumTermMomentum,
      relatedQueries,
      freshness,
      regionMatch,
      total,
    };
  }

  classify(score: number): "rising" | "good-opportunity" | "evergreen" | "weak" {
    if (score >= 80) {
      return "rising";
    }

    if (score >= 60) {
      return "good-opportunity";
    }

    if (score >= 40) {
      return "evergreen";
    }

    return "weak";
  }
}

export const trendsScorer = new TrendsScorer();
