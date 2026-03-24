import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  return (
    <button
      className={cn(
        "group w-full rounded-full bg-[linear-gradient(135deg,#101418,#243038)] px-6 py-3.5 text-sm font-medium text-white shadow-[0_16px_30px_rgba(16,20,24,0.18)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(16,20,24,0.24)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ink/10 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...rest}
    />
  );
}
