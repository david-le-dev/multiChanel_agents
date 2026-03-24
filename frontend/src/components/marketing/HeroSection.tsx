"use client";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";

export function HeroSection() {
  return (
    <section className="grid items-end gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-7"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="accent">Trend-backed AI Workflow</Badge>
          <Badge>Structured Output Dashboard</Badge>
        </div>

        <div className="space-y-5">
          <h1 className="max-w-5xl font-display text-5xl leading-[0.92] text-ink md:text-[5.4rem]">
            Turn one idea into a polished multi-channel campaign operating system.
          </h1>
          <p className="max-w-2xl text-[1.08rem] leading-8 text-ink/72">
            Built for structured analysis, not chat. The experience moves from campaign input
            to trend-backed reasoning to a premium results dashboard with strategy, copy assets,
            image prompts, and QA notes.
          </p>
        </div>

        <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
          {[
            ["Trend signals", "Momentum, freshness, and relevance before generation"],
            ["Brand modeling", "Voice-aware strategy instead of generic AI copy"],
            ["Multi-channel output", "Platform-ready assets organized in one dashboard"],
          ].map(([label, text]) => (
            <div
              key={label}
              className="rounded-[1.5rem] border border-white/70 bg-white/74 px-4 py-4 shadow-[0_12px_24px_rgba(16,20,24,0.06)]"
            >
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/generate" variant="primary">
            Build Content Pack
          </ButtonLink>
          <ButtonLink href="/results" variant="secondary">
            View Dashboard
          </ButtonLink>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        <Panel className="overflow-hidden p-0">
          <div className="bg-[linear-gradient(145deg,#101418,#2a373c)] px-6 py-6 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.24em] text-white/58">Workflow Pipeline</p>
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/28" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/16" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/16" />
              </div>
            </div>
            <h2 className="mt-3 font-display text-3xl leading-tight">Analysis engine overview</h2>
            <p className="mt-2 max-w-md text-sm leading-7 text-white/70">
              A recruiter-facing product shell that feels operational, not experimental.
            </p>
          </div>
          <div className="grid gap-3 p-6">
            {[
              "Real trend signals and freshness scoring",
              "Brand voice inference from campaign context",
              "Strategy generation across selected channels",
              "Content pack output for TikTok, Facebook, Instagram, and X",
              "Image prompts and QA review before delivery",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-[1.45rem] border border-ink/8 bg-white/92 px-4 py-4 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
              >
                <p className="max-w-[80%] text-sm leading-6 text-ink/76">{item}</p>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ember/10 text-xs font-semibold text-ember">
                  0{index + 1}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </motion.div>
    </section>
  );
}
