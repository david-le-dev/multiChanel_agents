import type { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <label className="grid gap-2 text-sm text-ink/80">
      <span className="font-medium tracking-[0.01em]">{label}</span>
      <textarea
        className="min-h-40 rounded-[1.4rem] border border-white/70 bg-white/92 px-4 py-3.5 text-[15px] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition focus:border-ember/45 focus:ring-4 focus:ring-ember/10"
        {...props}
      />
    </label>
  );
}
