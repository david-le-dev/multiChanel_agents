import { z } from "zod";

export const channelSchema = z.enum(["TikTok", "Facebook", "Instagram", "X"]);

export const analyzeInputSchema = z.object({
  topic: z.string().trim().min(2).max(160),
  articleUrl: z.string().trim().url().optional().or(z.literal("")),
  businessType: z.string().trim().min(2).max(120),
  targetAudience: z.string().trim().min(2).max(240),
  campaignGoal: z.string().trim().min(2).max(240),
  region: z.string().trim().min(2).max(120),
  brandTone: z.string().trim().min(2).max(160),
  selectedChannels: z.array(channelSchema).min(1),
  pastBrandContent: z.array(z.string().trim().min(1).max(2000)).max(10).optional().default([]),
});

export type AnalyzeInput = z.infer<typeof analyzeInputSchema>;

export const analyzeResponseSchema = z.object({
  topicSummary: z.string(),
  trendReport: z.object({
    status: z.string(),
    score: z.number().min(0).max(100),
    urgency: z.string(),
    relatedKeywords: z.array(z.string()),
    recommendedAngles: z.array(z.string()),
    explanation: z.string(),
  }),
  brandVoice: z.object({
    tone: z.string(),
    formality: z.string(),
    sentenceStyle: z.string(),
    ctaStyle: z.string(),
    preferredWords: z.array(z.string()),
    avoidWords: z.array(z.string()),
  }),
  strategy: z.object({
    coreAngle: z.string(),
    hooks: z.array(z.string()),
    channelStrategy: z.record(z.string()),
  }),
  contentPack: z.object({
    tiktokScript: z.string(),
    facebookPosts: z.array(z.string()),
    instagramCaption: z.string(),
    twitterThread: z.array(z.string()),
  }),
  imagePrompts: z.array(
    z.object({
      type: z.string(),
      prompt: z.string(),
    }),
  ),
  qa: z.object({
    status: z.enum(["passed", "needs-review"]),
    notes: z.array(z.string()),
  }),
});
