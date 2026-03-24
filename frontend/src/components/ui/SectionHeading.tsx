type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-2">
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-ember">{eyebrow}</p>
      ) : null}
      <h2 className="font-display text-3xl leading-[1.02] text-ink md:text-[2.85rem]">{title}</h2>
      {description ? <p className="max-w-2xl leading-8 text-ink/66">{description}</p> : null}
    </div>
  );
}
