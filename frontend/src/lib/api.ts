import type { AnalyzeRequest, AnalyzeResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function analyzeContent(input: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string;
      details?: {
        fieldErrors?: Record<string, string[] | undefined>;
        formErrors?: string[];
      };
      issues?: {
        fieldErrors?: Record<string, string[] | undefined>;
        formErrors?: string[];
      };
    } | null;

    const validation = payload?.details ?? payload?.issues;
    const issueLines = Object.entries(validation?.fieldErrors ?? {})
      .flatMap(([field, messages]) => (messages ?? []).map((message) => `${field}: ${message}`))
      .concat(validation?.formErrors ?? []);

    const errorMessage =
      issueLines.length > 0
        ? `${payload?.message ?? "Request failed"}\n${issueLines.join("\n")}`
        : payload?.message ?? "Failed to generate content pack.";

    throw new Error(errorMessage);
  }

  return response.json() as Promise<AnalyzeResponse>;
}

export { API_BASE_URL };
