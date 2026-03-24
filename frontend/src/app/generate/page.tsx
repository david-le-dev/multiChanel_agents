"use client";

import { useRouter } from "next/navigation";

import { CampaignForm } from "@/components/form/CampaignForm";
import { LoadingState } from "@/components/result/LoadingState";
import { Panel } from "@/components/ui/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useAnalyze } from "@/hooks/useAnalyze";
import { saveAnalyzeResult } from "@/lib/result-store";

export default function GeneratorPage() {
  const router = useRouter();
  const analyze = useAnalyze();

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <Panel className="h-fit space-y-6">
          <SectionHeading
            eyebrow="Generator"
            title="Configure the campaign analysis."
            description="Provide the core topic, the business context, and the channels that matter. The backend will orchestrate the full AI workflow."
          />
          <div className="grid gap-4 text-sm text-ink/68">
            {[
              "Real trend analysis before copy generation",
              "Brand voice profiling for stronger output fit",
              "Structured result dashboard instead of a chat transcript",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.45rem] border border-ink/8 bg-white/84 px-4 py-4 shadow-[0_10px_22px_rgba(16,20,24,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="rounded-[1.55rem] border border-ember/12 bg-[linear-gradient(135deg,rgba(199,92,42,0.08),rgba(255,255,255,0.72))] px-5 py-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ember">
              Output Structure
            </p>
            <p className="mt-3 text-sm leading-7 text-ink/72">
              Topic summary, trend scoring, brand voice, strategy, content pack, image prompts, and QA review.
            </p>
          </div>
        </Panel>

        <div className="space-y-6">
          <CampaignForm
            isSubmitting={analyze.isPending}
            error={analyze.error instanceof Error ? analyze.error.message : null}
            onSubmit={(values) =>
              analyze.mutate(values, {
                onSuccess: (response) => {
                  saveAnalyzeResult({
                    request: values,
                    response,
                    submittedAt: new Date().toISOString(),
                  });
                  router.push("/results");
                },
              })
            }
          />
          {analyze.isPending ? <LoadingState /> : null}
        </div>
      </div>
    </div>
  );
}
