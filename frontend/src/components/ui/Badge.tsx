import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "default" | "success" | "accent";
  className?: string;
};

export function Badge({ children, tone = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]",
        tone === "default" && "border-ink/8 bg-white/86 text-ink/70",
        tone === "success" && "border-moss/15 bg-moss/10 text-moss",
        tone === "accent" && "border-ember/15 bg-ember/10 text-ember",
        className,
      )}
    >
      {children}
    </span>
  );
}
