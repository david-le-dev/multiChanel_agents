import type { AnalyzeResponse } from "@/types/api";

import { Badge } from "@/components/ui/Badge";
import { ResultShell } from "./ResultShell";

type BrandVoiceCardProps = {
  brandVoice: AnalyzeResponse["brandVoice"];
};

export function BrandVoiceCard({ brandVoice }: BrandVoiceCardProps) {
  return (
    <ResultShell title="Brand Voice">
      <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["Tone", brandVoice.tone],
            ["Formality", brandVoice.formality],
            ["Sentence Style", brandVoice.sentenceStyle],
            ["CTA Style", brandVoice.ctaStyle],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[1.45rem] border border-ink/8 bg-white/84 px-4 py-4 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink/48">{label}</p>
              <p className="mt-3 text-base leading-7 text-ink/82">{value}</p>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className="rounded-[1.45rem] border border-moss/12 bg-moss/[0.04] px-5 py-5">
            <p className="mb-3 text-sm font-medium text-ink/70">Preferred words</p>
            <div className="flex flex-wrap gap-2">
              {brandVoice.preferredWords.map((item) => (
                <Badge key={item} tone="success">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-[1.45rem] border border-ink/8 bg-white/84 px-5 py-5">
            <p className="mb-3 text-sm font-medium text-ink/70">Avoid words</p>
            <div className="flex flex-wrap gap-2">
              {brandVoice.avoidWords.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ResultShell>
  );
}
