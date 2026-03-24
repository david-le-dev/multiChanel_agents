import type { ReactNode } from "react";

import { Panel } from "@/components/ui/Panel";
import { cn } from "@/lib/utils";

type ResultShellProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function ResultShell({ title, actions, children, className }: ResultShellProps) {
  return (
    <Panel className={cn("rounded-[2.1rem] p-7 md:p-8", className)}>
      <div className="flex flex-col gap-3 border-b border-ink/8 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ember">
            Structured Output
          </p>
          <h3 className="mt-2 font-display text-[2rem] leading-tight">{title}</h3>
        </div>
        {actions}
      </div>
      <div className="pt-6">{children}</div>
    </Panel>
  );
}
