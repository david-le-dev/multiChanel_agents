"use client";

import { useState } from "react";

import type { AnalyzeResponse } from "@/types/api";

import { CopyButton } from "@/components/ui/CopyButton";
import { ResultShell } from "./ResultShell";

const tabs = ["TikTok", "Facebook", "Instagram", "X"] as const;

type ContentPackTabsProps = {
  contentPack: AnalyzeResponse["contentPack"];
};

export function ContentPackTabs({ contentPack }: ContentPackTabsProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("TikTok");

  const tabContent = {
    TikTok: contentPack.tiktokScript,
    Facebook: contentPack.facebookPosts.join("\n\n"),
    Instagram: contentPack.instagramCaption,
    X: contentPack.twitterThread.join("\n"),
  };
  const activeContent = tabContent[activeTab]?.trim() || "No content generated for this channel yet.";

  return (
    <ResultShell
      title="Content Pack"
      actions={<CopyButton value={activeContent} copyKey={`tab-${activeTab}`} />}
    >
      <div className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`rounded-[1.35rem] px-4 py-3 text-left text-sm font-medium transition duration-200 ${
                activeTab === tab
                  ? "bg-[linear-gradient(135deg,#101418,#27343a)] text-white shadow-[0_16px_32px_rgba(16,20,24,0.18)]"
                  : "border border-white/70 bg-white/86 text-ink/72 hover:-translate-y-0.5 hover:bg-white"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              <div className="flex items-center justify-between">
                <span>{tab}</span>
                <span className={`text-[10px] uppercase tracking-[0.12em] ${activeTab === tab ? "text-white/55" : "text-ink/40"}`}>
                  Live
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-[1.8rem] border border-ink/8 bg-[linear-gradient(150deg,#101418,#223036)] px-6 py-6 text-sm leading-7 text-slate-50 shadow-[0_18px_44px_rgba(16,20,24,0.16)]">
          <pre className="whitespace-pre-wrap break-words font-sans text-slate-50">{activeContent}</pre>
        </div>
      </div>
    </ResultShell>
  );
}
