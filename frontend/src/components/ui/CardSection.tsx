import type { PropsWithChildren } from "react";

type CardSectionProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export function CardSection({
  title,
  description,
  children,
}: CardSectionProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-[1.8rem] leading-tight text-ink">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-ink/62">{description}</p>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}
