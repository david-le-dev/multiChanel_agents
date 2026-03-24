"use client";

import { motion } from "framer-motion";

import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";

const features = [
  {
    title: "Trend Intelligence",
    body: "Uses external trend signals to score momentum, freshness, and regional relevance before content is generated.",
  },
  {
    title: "Brand-aware Planning",
    body: "Infers tone, CTA style, vocabulary preferences, and audience fit to avoid generic AI marketing output.",
  },
  {
    title: "Structured Multi-channel Output",
    body: "Returns a clear dashboard of summaries, strategy, copy assets, image prompts, and QA notes instead of a chat transcript.",
  },
];

export function FeatureCards() {
  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="Why It Feels Real"
        title="Built like a focused AI product, not a prompt playground."
        description="The frontend emphasizes a clear input-to-analysis-to-dashboard flow so the product reads like a serious internal marketing tool."
      />
      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
          >
            <Panel className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(16,20,24,0.12)]">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
                0{index + 1}
              </div>
              <h3 className="mt-5 font-display text-2xl">{feature.title}</h3>
              <p className="mt-3 leading-7 text-ink/70">{feature.body}</p>
            </Panel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
