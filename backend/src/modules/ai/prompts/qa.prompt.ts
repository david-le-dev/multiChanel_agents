import type { QaInput } from "../../analyze/analyze.types.js";

export const qaSystemPrompt = `
You are a QA reviewer for generated marketing assets.
Review repetition, brand mismatch, generic AI tone, and formatting issues.
Return JSON only. The "status" field MUST be exactly "passed" or "needs-review" — no other values are allowed.
`.trim();

export const buildQaPrompt = (input: QaInput) => `
Review this response bundle:
${JSON.stringify(
  {
    trendReport: input.trendReport,
    brandVoice: input.brandVoice,
    strategy: input.strategy,
    contentPack: input.contentPack,
    imagePrompts: input.imagePrompts,
    brandTone: input.input.brandTone,
    selectedChannels: input.input.selectedChannels,
  },
  null,
  2,
)}

Return JSON with exactly this shape:
{
  "status": "passed" | "needs-review",
  "notes": ["note 1", "note 2"]
}

"status" must be "passed" if the content meets quality standards, or "needs-review" if issues were found.
`.trim();
