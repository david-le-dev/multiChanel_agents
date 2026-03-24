import { CopyButton } from "@/components/ui/CopyButton";
import { ResultShell } from "./ResultShell";

type TopicSummaryCardProps = {
  topicSummary: string;
};

export function TopicSummaryCard({ topicSummary }: TopicSummaryCardProps) {
  return (
    <ResultShell
      title="Topic Summary"
      actions={<CopyButton value={topicSummary} copyKey="topic-summary" />}
    >
      <div className="rounded-[1.6rem] border border-ink/8 bg-white/84 px-5 py-5 shadow-[0_10px_22px_rgba(16,20,24,0.05)]">
        <p className="max-w-4xl text-base leading-8 text-ink/78">{topicSummary}</p>
      </div>
    </ResultShell>
  );
}
