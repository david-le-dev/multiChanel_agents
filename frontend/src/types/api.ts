export type Channel = "TikTok" | "Facebook" | "Instagram" | "X";

export interface AnalyzeRequest {
  topic: string;
  articleUrl?: string;
  businessType: string;
  targetAudience: string;
  campaignGoal: string;
  region: string;
  brandTone: string;
  selectedChannels: Channel[];
  pastBrandContent?: string[];
}

export interface AnalyzeResponse {
  topicSummary: string;
  trendReport: {
    status: "rising" | "good-opportunity" | "evergreen" | "weak";
    score: number;
    urgency: string;
    relatedKeywords: string[];
    recommendedAngles: string[];
    explanation: string;
  };
  brandVoice: {
    tone: string;
    formality: string;
    sentenceStyle: string;
    ctaStyle: string;
    preferredWords: string[];
    avoidWords: string[];
  };
  strategy: {
    coreAngle: string;
    hooks: string[];
    channelStrategy: Record<string, string>;
  };
  contentPack: {
    tiktokScript: string;
    facebookPosts: string[];
    instagramCaption: string;
    twitterThread: string[];
  };
  imagePrompts: Array<{
    type: "hero" | "product-service" | "social";
    prompt: string;
  }>;
  qa: {
    status: "passed" | "needs-review";
    notes: string[];
  };
}
