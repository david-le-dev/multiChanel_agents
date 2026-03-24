import { motion } from "framer-motion";

import { Panel } from "@/components/ui/Panel";

export function LoadingState() {
  return (
    <Panel className="space-y-6 overflow-hidden">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ember">
        Analysis In Progress
      </p>
      <div className="flex gap-3">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="h-3 w-3 rounded-full bg-ember"
            animate={{ y: [0, -9, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1, delay: index * 0.15 }}
          />
        ))}
      </div>
      <p className="max-w-2xl leading-8 text-ink/68">
        Running trend lookup, brand voice inference, strategic planning, content generation,
        image prompt creation, and QA checks.
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-[1.45rem] border border-white/70 bg-white/86 px-4 py-4"
          >
            <motion.div
              className="h-3 rounded-full bg-ink/10"
              animate={{ opacity: [0.45, 0.9, 0.45] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: item * 0.08 }}
            />
            <motion.div
              className="mt-3 h-3 w-3/4 rounded-full bg-ink/8"
              animate={{ opacity: [0.35, 0.75, 0.35] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: item * 0.1 }}
            />
          </div>
        ))}
      </div>
    </Panel>
  );
}
