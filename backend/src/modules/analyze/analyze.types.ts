import type { AnalyzeInput } from "./analyze.schema.js";

export type Channel = AnalyzeInput["selectedChannels"][number];

export interface TrendReport {
  status: "rising" | "good-opportunity" | "evergreen" | "weak";
  score: number;
  urgency: string;
  relatedKeywords: string[];
  recommendedAngles: string[];
  explanation: string;
}

export interface BrandVoiceProfile {
  tone: string;
  formality: string;
  sentenceStyle: string;
  ctaStyle: string;
  preferredWords: string[];
  avoidWords: string[];
}

export interface StrategyPlan {
  coreAngle: string;
  hooks: string[];
  channelStrategy: Record<string, string>;
}

export interface ContentPack {
  tiktokScript: string;
  facebookPosts: string[];
  instagramCaption: string;
  twitterThread: string[];
}

export interface ImagePromptSet {
  type: "hero" | "product-service" | "social";
  prompt: string;
}

export interface QaReport {
  status: "passed" | "needs-review";
  notes: string[];
}

export interface SourceInsight {
  summary: string;
  candidateKeywords: string[];
  articleTitle?: string;
}

export interface AnalyzeResponse {
  topicSummary: string;
  trendReport: TrendReport;
  brandVoice: BrandVoiceProfile;
  strategy: StrategyPlan;
  contentPack: ContentPack;
  imagePrompts: ImagePromptSet[];
  qa: QaReport;
}

export interface NormalizedAnalyzeInput extends Omit<AnalyzeInput, "articleUrl" | "pastBrandContent"> {
  articleUrl?: string;
  pastBrandContent: string[];
}

export interface WorkflowContext {
  input: NormalizedAnalyzeInput;
  sourceInsight?: SourceInsight;
}

export interface BrandVoiceInput extends WorkflowContext {
  trendReport: TrendReport;
}

export interface StrategyInput extends WorkflowContext {
  trendReport: TrendReport;
  brandVoice: BrandVoiceProfile;
}

export interface ContentInput extends WorkflowContext {
  trendReport: TrendReport;
  brandVoice: BrandVoiceProfile;
  strategy: StrategyPlan;
}

export interface ImagePromptInput extends WorkflowContext {
  trendReport: TrendReport;
  strategy: StrategyPlan;
  brandVoice: BrandVoiceProfile;
}

export interface QaInput extends WorkflowContext {
  trendReport: TrendReport;
  brandVoice: BrandVoiceProfile;
  strategy: StrategyPlan;
  contentPack: ContentPack;
  imagePrompts: ImagePromptSet[];
}
