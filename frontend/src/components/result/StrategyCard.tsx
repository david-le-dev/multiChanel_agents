import type { AnalyzeResponse } from "@/types/api";

import { ResultShell } from "./ResultShell";

type StrategyCardProps = {
  strategy: AnalyzeResponse["strategy"];
};

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <ResultShell title="Strategy">
      <div className="space-y-7">
        <div className="rounded-[1.6rem] border border-ink/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(245,240,232,0.7))] px-5 py-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink/48">Core Angle</p>
          <p className="mt-3 max-w-4xl text-lg leading-8 text-ink/82">{strategy.coreAngle}</p>
        </div>
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.16em] text-ink/52">Hooks</p>
          <div className="grid gap-3 md:grid-cols-3">
            {strategy.hooks.map((hook) => (
              <div
                key={hook}
                className="rounded-[1.45rem] border border-ink/8 bg-white/88 px-4 py-4 text-sm leading-7 text-ink/78 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
              >
                {hook}
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.16em] text-ink/52">Channel Strategy</p>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(strategy.channelStrategy).map(([channel, value]) => (
              <div
                key={channel}
                className="rounded-[1.45rem] border border-ink/8 bg-white/88 px-4 py-4 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ember">
                  {channel}
                </p>
                <p className="mt-3 text-sm leading-7 text-ink/74">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ResultShell>
  );
}
