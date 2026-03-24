"use client";

import { useEffect, useState } from "react";

import { ResultDashboard } from "@/components/result/ResultDashboard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { readAnalyzeResult, type StoredAnalyzeResult } from "@/lib/result-store";

export default function ResultsPage() {
  const [result, setResult] = useState<StoredAnalyzeResult | null>(null);

  useEffect(() => {
    setResult(readAnalyzeResult());
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10 lg:py-14">
      {result ? (
        <ResultDashboard data={result.response} submittedAt={result.submittedAt} />
      ) : (
        <Panel className="space-y-6">
          <SectionHeading
            eyebrow="No Session Result"
            title="Run the generator to populate this dashboard."
            description="This page reads the latest generated analysis from the current browser session. Once you submit a campaign on the generator page, the full structured output will appear here."
          />
          <div className="rounded-[1.5rem] border border-ink/8 bg-white/86 px-5 py-5 text-sm leading-7 text-ink/68 shadow-[0_10px_22px_rgba(16,20,24,0.05)]">
            The result view is intentionally structured like an internal AI product dashboard rather than a chat transcript.
          </div>
          <ButtonLink href="/generate" variant="primary" className="w-fit">
            Open Generator
          </ButtonLink>
        </Panel>
      )}
    </div>
  );
}
