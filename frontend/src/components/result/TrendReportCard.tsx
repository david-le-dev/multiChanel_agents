import type { AnalyzeResponse } from "@/types/api";

import { Badge } from "@/components/ui/Badge";
import { ResultShell } from "./ResultShell";

type TrendReportCardProps = {
  trendReport: AnalyzeResponse["trendReport"];
};

export function TrendReportCard({ trendReport }: TrendReportCardProps) {
  return (
    <ResultShell
      title="Trend Report"
      className="bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,250,246,0.94))]"
    >
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="rounded-[1.8rem] border border-ember/12 bg-[linear-gradient(145deg,#101418,#29363b)] p-6 text-white shadow-[0_24px_60px_rgba(16,20,24,0.16)]">
          <Badge tone="accent" className="border-white/10 bg-white/10 text-white">
            {trendReport.status}
          </Badge>
          <p className="mt-5 font-display text-7xl leading-none">{trendReport.score}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/58">Trend Score</p>
          <div className="mt-6 rounded-[1.3rem] border border-white/8 bg-white/6 px-4 py-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/50">Posting urgency</p>
            <p className="mt-2 text-sm leading-7 text-white/85">{trendReport.urgency}</p>
          </div>
        </div>
        <div className="space-y-5">
          <p className="rounded-[1.5rem] border border-ink/8 bg-white/74 px-5 py-5 leading-8 text-ink/74">
            {trendReport.explanation}
          </p>
          <div>
            <p className="mb-3 text-sm font-medium text-ink/70">Related keywords</p>
            <div className="flex flex-wrap gap-2">
              {trendReport.relatedKeywords.map((keyword) => (
                <Badge key={keyword}>{keyword}</Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-medium text-ink/70">Recommended angles</p>
            <ul className="grid gap-3 text-sm leading-7 text-ink/74">
              {trendReport.recommendedAngles.map((angle, index) => (
                <li
                  key={angle}
                  className="flex gap-4 rounded-[1.45rem] border border-ink/8 bg-white/86 px-4 py-4 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ember/10 text-xs font-semibold text-ember">
                    0{index + 1}
                  </span>
                  <span>{angle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ResultShell>
  );
}
