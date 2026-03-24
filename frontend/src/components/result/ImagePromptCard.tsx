import type { AnalyzeResponse } from "@/types/api";

import { CopyButton } from "@/components/ui/CopyButton";
import { ResultShell } from "./ResultShell";

type ImagePromptCardProps = {
  imagePrompts: AnalyzeResponse["imagePrompts"];
};

export function ImagePromptCard({ imagePrompts }: ImagePromptCardProps) {
  return (
    <ResultShell title="Image Prompts">
      <div className="grid gap-4">
        {imagePrompts.map((item, index) => (
          <div
            key={`${item.type}-${index}`}
            className="rounded-[1.6rem] border border-ink/8 bg-white/88 px-5 py-5 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember">
                {item.type}
              </p>
              <CopyButton value={item.prompt} copyKey={`prompt-${item.type}-${index}`} />
            </div>
            <p className="mt-3 text-sm leading-7 text-ink/76">{item.prompt}</p>
          </div>
        ))}
      </div>
    </ResultShell>
  );
}
