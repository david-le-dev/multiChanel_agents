import type { AnalyzeResponse } from "@/types/api";

import { Badge } from "@/components/ui/Badge";
import { ResultShell } from "./ResultShell";

type QACardProps = {
  qa: AnalyzeResponse["qa"];
};

export function QACard({ qa }: QACardProps) {
  return (
    <ResultShell title="QA Notes">
      <div className="space-y-4">
        <Badge tone={qa.status === "passed" ? "success" : "accent"}>{qa.status}</Badge>
        <ul className="grid gap-3">
          {qa.notes.map((note, index) => (
            <li
              key={note}
              className="flex gap-4 rounded-[1.45rem] border border-ink/8 bg-white/86 px-4 py-4 text-sm leading-7 text-ink/76 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss/10 text-xs font-semibold text-moss">
                0{index + 1}
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      </div>
    </ResultShell>
  );
}
