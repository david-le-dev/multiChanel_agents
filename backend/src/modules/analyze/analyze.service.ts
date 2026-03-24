import { env } from "../../config/env.js";
import {
  extractMetaContent,
  extractReadableArticle,
  stripHtml,
  summarizeText,
  topKeywords,
  uniqueStrings,
} from "../../shared/utils.js";
import { brandVoiceService } from "../brand-voice/brandVoice.service.js";
import { contentService } from "../content/content.service.js";
import { imagePromptService } from "../image-prompts/imagePrompt.service.js";
import { qaService } from "../qa/qa.service.js";
import { strategyService } from "../strategy/strategy.service.js";
import { trendsService } from "../trends/trends.service.js";

import type { AnalyzeInput } from "./analyze.schema.js";
import type {
  AnalyzeResponse,
  NormalizedAnalyzeInput,
  SourceInsight,
  WorkflowContext,
} from "./analyze.types.js";

class AnalyzeService {
  async run(input: AnalyzeInput): Promise<AnalyzeResponse> {
    const normalizedInput = this.normalizeInput(input);
    const sourceInsight = normalizedInput.articleUrl
      ? await this.deriveSourceInsight(normalizedInput.articleUrl)
      : undefined;
    const workflowContext: WorkflowContext = {
      input: normalizedInput,
      sourceInsight,
    };

    const trendReport = await trendsService.analyze(workflowContext);
    const brandVoice = await brandVoiceService.analyze({
      ...workflowContext,
      trendReport,
    });
    const strategy = await strategyService.build({
      ...workflowContext,
      trendReport,
      brandVoice,
    });
    const [contentPack, imagePrompts] = await Promise.all([
      contentService.generate({
        ...workflowContext,
        trendReport,
        brandVoice,
        strategy,
      }),
      imagePromptService.generate({
        ...workflowContext,
        trendReport,
        brandVoice,
        strategy,
      }),
    ]);
    const qa = await qaService.review({
      ...workflowContext,
      trendReport,
      brandVoice,
      strategy,
      contentPack,
      imagePrompts,
    });

    const topicSummary = this.buildTopicSummary(workflowContext);

    return {
      topicSummary,
      trendReport,
      brandVoice,
      strategy,
      contentPack,
      imagePrompts,
      qa,
    };
  }

  private normalizeInput(input: AnalyzeInput): NormalizedAnalyzeInput {
    return {
      topic: input.topic.trim(),
      articleUrl: input.articleUrl?.trim() || undefined,
      businessType: input.businessType.trim(),
      targetAudience: input.targetAudience.trim(),
      campaignGoal: input.campaignGoal.trim(),
      region: input.region.trim(),
      brandTone: input.brandTone.trim(),
      selectedChannels: [...new Set(input.selectedChannels)],
      pastBrandContent: uniqueStrings(input.pastBrandContent ?? []),
    };
  }

  private async deriveSourceInsight(articleUrl: string): Promise<SourceInsight | undefined> {
    try {
      const response = await fetch(articleUrl, {
        signal: AbortSignal.timeout(env.REQUEST_TIMEOUT_MS),
        headers: {
          "User-Agent": "AI-Multi-channel-Content-Orchestrator/1.0",
        },
      });

      if (!response.ok) {
        return undefined;
      }

      const html = await response.text();
      const articleTitle = extractMetaContent(html, "og:title") ?? html.match(/<title>(.*?)<\/title>/i)?.[1]?.trim();
      const articleDescription =
        extractMetaContent(html, "description") ?? extractMetaContent(html, "og:description");
      const articleBody = extractReadableArticle(html) ?? stripHtml(html);
      const cleanedText = `${articleDescription ?? ""} ${articleBody}`.trim().slice(0, 6000);
      const summary = summarizeText(articleDescription ? `${articleDescription}. ${cleanedText}` : cleanedText, 3);
      const candidateKeywords = topKeywords(
        `${articleTitle ?? ""} ${articleDescription ?? ""} ${articleBody}`,
        8,
      );

      if (!summary) {
        return undefined;
      }

      return {
        summary,
        candidateKeywords,
        articleTitle,
      };
    } catch {
      return undefined;
    }
  }

  private buildTopicSummary({ input, sourceInsight }: WorkflowContext) {
    const articleClause = sourceInsight?.summary
      ? ` Source context: ${sourceInsight.summary}`
      : "";
    const keywordClause =
      sourceInsight?.candidateKeywords.length
        ? ` Candidate keywords: ${sourceInsight.candidateKeywords.slice(0, 5).join(", ")}.`
        : "";

    return `${input.businessType} wants to position "${input.topic}" for ${input.targetAudience} in ${input.region} with a ${input.brandTone} tone, optimized for ${input.selectedChannels.join(", ")}.${articleClause}${keywordClause}`;
  }
}

export const analyzeService = new AnalyzeService();
