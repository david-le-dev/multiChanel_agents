import type { AnalyzeResponse } from "@/types/api";

import { Badge } from "@/components/ui/Badge";
import { CopyButton } from "@/components/ui/CopyButton";
import { Panel } from "@/components/ui/Panel";
import { BrandVoiceCard } from "./BrandVoiceCard";
import { ContentPackTabs } from "./ContentPackTabs";
import { ImagePromptCard } from "./ImagePromptCard";
import { QACard } from "./QACard";
import { StrategyCard } from "./StrategyCard";
import { TopicSummaryCard } from "./TopicSummaryCard";
import { TrendReportCard } from "./TrendReportCard";

type ResultDashboardProps = {
  data: AnalyzeResponse;
  submittedAt?: string;
};

export function ResultDashboard({ data, submittedAt }: ResultDashboardProps) {
  return (
    <div className="grid gap-6">
      <Panel className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <Badge tone="accent">Analysis Complete</Badge>
          <h1 className="font-display text-4xl leading-[0.98] md:text-5xl">
            Campaign intelligence dashboard
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-ink/72">{data.topicSummary}</p>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border border-ink/8 bg-[linear-gradient(145deg,#101418,#263339)] px-5 py-5 text-white shadow-[0_18px_44px_rgba(16,20,24,0.16)]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Latest run</p>
            <p className="mt-2 text-sm text-white/82">
              {submittedAt
                ? new Date(submittedAt).toLocaleString()
                : "Session result loaded from the current browser tab."}
            </p>
          </div>
          <CopyButton value={JSON.stringify(data, null, 2)} copyKey="full-result" />
        </div>
      </Panel>

      <TrendReportCard trendReport={data.trendReport} />
      <TopicSummaryCard topicSummary={data.topicSummary} />
      <BrandVoiceCard brandVoice={data.brandVoice} />
      <StrategyCard strategy={data.strategy} />
      <ContentPackTabs contentPack={data.contentPack} />
      <ImagePromptCard imagePrompts={data.imagePrompts} />
      <QACard qa={data.qa} />
    </div>
  );
}
