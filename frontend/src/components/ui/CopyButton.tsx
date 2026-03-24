"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

type CopyButtonProps = {
  value: string;
  copyKey: string;
};

export function CopyButton({ value, copyKey }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value, copyKey)}
      className="rounded-full border border-ink/10 bg-white/88 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/65 shadow-[0_8px_20px_rgba(16,20,24,0.06)] transition hover:-translate-y-0.5 hover:border-ink/18 hover:text-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/10"
    >
      {copied === copyKey ? "Copied" : "Copy Text"}
    </button>
  );
}
