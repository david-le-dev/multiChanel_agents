"use client";

import { useMutation } from "@tanstack/react-query";

import { analyzeContent } from "@/lib/api";
import type { AnalyzeRequest } from "@/types/api";

export function useAnalyze() {
  return useMutation({
    mutationFn: (input: AnalyzeRequest) => analyzeContent(input),
  });
}
