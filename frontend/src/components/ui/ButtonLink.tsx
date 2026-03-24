import Link, { type LinkProps } from "next/link";
import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    variant?: "primary" | "secondary" | "ghost";
  }
>;

export function ButtonLink({
  children,
  className,
  variant = "secondary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/10",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#101418,#243038)] text-white shadow-[0_16px_30px_rgba(16,20,24,0.18)] hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(16,20,24,0.24)]",
        variant === "secondary" &&
          "border border-white/70 bg-white/88 text-ink shadow-[0_10px_24px_rgba(16,20,24,0.08)] hover:border-ink/12 hover:bg-white hover:-translate-y-0.5",
        variant === "ghost" && "text-ink/70 hover:bg-white/55 hover:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
