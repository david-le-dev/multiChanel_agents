import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import { clamp, uniqueStrings } from "../../shared/utils.js";

import type { WorkflowContext } from "../analyze/analyze.types.js";

export interface InterestPoint {
  timestamp: string;
  value: number;
}

export interface RelatedTerm {
  term: string;
  value: number;
}

export interface FreshnessSignal {
  score: number;
  headlines: string[];
  recentArticleCount: number;
}

export interface RawTrendSignal {
  source: "serpapi" | "mock";
  interestOverTime: InterestPoint[];
  relatedQueries: RelatedTerm[];
  relatedTopics: RelatedTerm[];
  regionRelevance: number;
  freshness: FreshnessSignal;
}

export interface TrendProvider {
  fetchSignals(context: WorkflowContext): Promise<RawTrendSignal>;
}

class SerpApiTrendsProvider implements TrendProvider {
  async fetchSignals(context: WorkflowContext): Promise<RawTrendSignal> {
    if (!env.SERPAPI_API_KEY) {
      throw new AppError("SERPAPI_API_KEY is required when TREND_PROVIDER=serpapi", 500);
    }

    const geo = resolveGeoCode(context.input.region);
    const query = uniqueStrings([
      context.input.topic,
      ...(context.sourceInsight?.candidateKeywords ?? []),
    ])[0];

    const [timeSeries, relatedQueries, relatedTopics, geoMap, freshness] = await Promise.all([
      this.fetchTrendsData("TIMESERIES", query, geo),
      this.fetchTrendsData("RELATED_QUERIES", query, geo),
      this.fetchTrendsData("RELATED_TOPICS", query, geo),
      this.fetchTrendsData("GEO_MAP_0", query, geo),
      this.fetchFreshness(query, geo),
    ]);

    return {
      source: "serpapi",
      interestOverTime: parseInterestOverTime(timeSeries),
      relatedQueries: parseRelatedTerms(relatedQueries, "related_queries"),
      relatedTopics: parseRelatedTerms(relatedTopics, "related_topics"),
      regionRelevance: parseRegionRelevance(geoMap, context.input.region),
      freshness,
    };
  }

  private async fetchTrendsData(dataType: string, query: string, geo?: string) {
    const searchParams = new URLSearchParams({
      engine: "google_trends",
      q: query,
      data_type: dataType,
      date: env.SERPAPI_TRENDS_TIMEFRAME,
      api_key: env.SERPAPI_API_KEY ?? "",
    });

    if (geo) {
      searchParams.set("geo", geo);
    }

    const response = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`, {
      signal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      throw new AppError(`SerpApi trends request failed for ${dataType}`, response.status);
    }

    return (await response.json()) as Record<string, unknown>;
  }

  private async fetchFreshness(query: string, geo?: string): Promise<FreshnessSignal> {
    const searchParams = new URLSearchParams({
      engine: "google",
      q: query,
      tbm: "nws",
      num: "10",
      api_key: env.SERPAPI_API_KEY ?? "",
    });

    if (geo) {
      searchParams.set("gl", geo.toLowerCase());
    }

    const response = await fetch(`https://serpapi.com/search.json?${searchParams.toString()}`, {
      signal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) {
      return {
        score: 0,
        headlines: [],
        recentArticleCount: 0,
      };
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const results = Array.isArray(payload.news_results)
      ? (payload.news_results as Array<Record<string, unknown>>)
      : [];
    const ages = results
      .map((item) => parseRelativeAgeHours(String(item.date ?? "")))
      .filter((age): age is number => typeof age === "number");
    const recentArticleCount = ages.filter((age) => age <= 72).length;
    const score = ages.length === 0 ? 0 : clamp(Math.round((recentArticleCount / ages.length) * 100), 0, 100);

    return {
      score,
      headlines: results.slice(0, 5).map((item) => String(item.title ?? "")).filter(Boolean),
      recentArticleCount,
    };
  }
}

class MockTrendsProvider implements TrendProvider {
  async fetchSignals(context: WorkflowContext): Promise<RawTrendSignal> {
    const seed = hashString(`${context.input.topic}:${context.input.region}`);
    const base = 35 + (seed % 35);
    const momentum = [0, 4, 9, 14, 18, 24].map((offset, index) => ({
      timestamp: `${index + 1}`,
      value: clamp(base + offset, 0, 100),
    }));
    const keywords = uniqueStrings([
      context.input.topic,
      context.input.businessType,
      ...(context.sourceInsight?.candidateKeywords ?? []),
    ]);

    return {
      source: "mock",
      interestOverTime: momentum,
      relatedQueries: keywords.slice(0, 5).map((term, index) => ({
        term,
        value: clamp(90 - index * 12, 10, 100),
      })),
      relatedTopics: keywords.slice(1, 6).map((term, index) => ({
        term,
        value: clamp(82 - index * 10, 10, 100),
      })),
      regionRelevance: clamp(55 + (seed % 30), 0, 100),
      freshness: {
        score: clamp(50 + (seed % 30), 0, 100),
        headlines: [
          `${context.input.topic} continues to gain attention`,
          `${context.input.region} market shows interest in ${context.input.topic}`,
        ],
        recentArticleCount: 3,
      },
    };
  }
}

class TrendsProviderFactory {
  create(): TrendProvider {
    if (env.TREND_PROVIDER === "serpapi" && env.SERPAPI_API_KEY) {
      const primary = new SerpApiTrendsProvider();
      const fallback = new MockTrendsProvider();

      return {
        async fetchSignals(context: WorkflowContext) {
          try {
            return await primary.fetchSignals(context);
          } catch (error) {
            console.warn("Falling back to mock trend signals", error);
            return fallback.fetchSignals(context);
          }
        },
      };
    }

    return new MockTrendsProvider();
  }
}

const parseInterestOverTime = (payload: Record<string, unknown>): InterestPoint[] => {
  const timeline =
    (payload.interest_over_time as { timeline_data?: Array<Record<string, unknown>> } | undefined)
      ?.timeline_data ??
    (payload.timeline_data as Array<Record<string, unknown>> | undefined) ??
    [];

  return timeline
    .map((entry, index) => ({
      timestamp: String(entry.date ?? entry.formattedTime ?? index),
      value: clamp(
        Number(
          Array.isArray(entry.values)
            ? (entry.values[0] as Record<string, unknown>)?.extracted_value ?? entry.values[0]
            : entry.extracted_value ?? entry.value ?? 0,
        ),
        0,
        100,
      ),
    }))
    .filter((entry) => Number.isFinite(entry.value));
};

const parseRelatedTerms = (
  payload: Record<string, unknown>,
  key: "related_queries" | "related_topics",
): RelatedTerm[] => {
  const root = payload[key] as
    | {
        rising?: Array<Record<string, unknown>>;
        top?: Array<Record<string, unknown>>;
      }
    | undefined;
  const list = [...(root?.rising ?? []), ...(root?.top ?? [])];

  return uniqueStrings(
    list.map((item) => String(item.query ?? item.topic ?? "")).filter(Boolean),
  ).map((term, index) => ({
    term,
    value: clamp(Number(list[index]?.value ?? list[index]?.extracted_value ?? 50), 0, 100),
  }));
};

const parseRegionRelevance = (payload: Record<string, unknown>, region: string) => {
  const rows =
    (payload.interest_by_region as Array<Record<string, unknown>> | undefined) ??
    (payload.geo_map_data as Array<Record<string, unknown>> | undefined) ??
    [];

  const match = rows.find((row) =>
    String(row.location ?? row.region ?? "").toLowerCase().includes(region.toLowerCase()),
  );

  return clamp(Number(match?.value ?? match?.extracted_value ?? 55), 0, 100);
};

const resolveGeoCode = (region: string) => {
  const normalized = region.trim().toLowerCase();
  const mapping: Record<string, string> = {
    "united states": "US",
    usa: "US",
    canada: "CA",
    "united kingdom": "GB",
    uk: "GB",
    australia: "AU",
    germany: "DE",
    france: "FR",
    india: "IN",
    singapore: "SG",
  };

  if (mapping[normalized]) {
    return mapping[normalized];
  }

  return /^[a-z]{2}$/i.test(region) ? region.toUpperCase() : undefined;
};

const parseRelativeAgeHours = (input: string) => {
  const value = input.trim().toLowerCase();
  const hourMatch = value.match(/(\d+)\s*hour/);
  if (hourMatch) {
    return Number(hourMatch[1]);
  }

  const dayMatch = value.match(/(\d+)\s*day/);
  if (dayMatch) {
    return Number(dayMatch[1]) * 24;
  }

  const weekMatch = value.match(/(\d+)\s*week/);
  if (weekMatch) {
    return Number(weekMatch[1]) * 24 * 7;
  }

  return undefined;
};

const hashString = (value: string) =>
  value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

const providerFactory = new TrendsProviderFactory();

export const trendsProvider = providerFactory.create();
