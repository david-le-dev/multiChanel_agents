import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type PanelProps = PropsWithChildren<{
  className?: string;
}>;

export function Panel({ className, children }: PanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-white/75 bg-white/82 p-6 shadow-panel backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.35),transparent_35%)] before:opacity-90",
        className,
      )}
    >
      <div className="relative">{children}</div>
    </div>
  );
}
