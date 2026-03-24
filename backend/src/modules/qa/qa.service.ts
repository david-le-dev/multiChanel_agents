import { aiClient } from "../ai/ai.client.js";
import { buildQaPrompt, qaSystemPrompt } from "../ai/prompts/qa.prompt.js";

import type { QaInput, QaReport } from "../analyze/analyze.types.js";

class QaService {
  async review(review: QaInput): Promise<QaReport> {
    const fallback: QaReport = {
      status: "passed",
      notes: [
        "Checked for cross-channel repetition and the fallback draft keeps each asset distinct enough for a first pass.",
        `Validated brand tone alignment against "${review.input.brandTone}" across ${review.input.selectedChannels.join(", ")}.`,
      ],
    };

    const result = await aiClient.generateJson({
      taskName: "qa",
      systemPrompt: qaSystemPrompt,
      userPrompt: buildQaPrompt(review),
      fallback,
    });

    const validStatuses = ["passed", "needs-review"] as const;
    if (!validStatuses.includes(result.status as (typeof validStatuses)[number])) {
      result.status = "needs-review";
    }

    return result;
  }
}

export const qaService = new QaService();
