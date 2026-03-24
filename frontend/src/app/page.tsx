import { FeatureCards } from "@/components/marketing/FeatureCards";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function LandingPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-20 px-6 py-12 lg:px-10 lg:py-16">
      <HeroSection />

      <FeatureCards />

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Panel className="space-y-5">
          <SectionHeading
            eyebrow="What You Get"
            title="A clear analysis-to-output workflow."
            description="The product is organized around structured sections so teams can move from idea validation to distribution-ready assets without jumping between tools."
          />
        </Panel>
        <Panel className="grid gap-4">
          {[
            "Topic summary with source context if an article URL is supplied",
            "Trend report with score, status, urgency, angles, and related keywords",
            "Brand voice profile tuned to campaign inputs and historical examples",
            "Platform-native content pack for TikTok, Facebook, Instagram, and X",
            "Image prompts and QA notes for cleaner downstream production",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[1.45rem] border border-ink/8 bg-white/88 px-4 py-4 text-sm leading-7 text-ink/76 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
            >
              {item}
            </div>
          ))}
        </Panel>
      </section>

      <Panel className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.28em] text-ember">Ready To Run</p>
          <h2 className="font-display text-3xl leading-tight">
            Open the generator and build your first campaign pack.
          </h2>
        </div>
        <ButtonLink href="/generate" variant="primary">
          Go To Generator
        </ButtonLink>
      </Panel>
    </div>
  );
}
