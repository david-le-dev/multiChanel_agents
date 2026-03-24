import type { AnalyzeRequest, AnalyzeResponse } from "@/types/api";

const RESULT_KEY = "ai-orchestrator-latest-result";

export interface StoredAnalyzeResult {
  submittedAt: string;
  request: AnalyzeRequest;
  response: AnalyzeResponse;
}

export function saveAnalyzeResult(result: StoredAnalyzeResult) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
}

export function readAnalyzeResult(): StoredAnalyzeResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(RESULT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAnalyzeResult;
  } catch {
    return null;
  }
}
