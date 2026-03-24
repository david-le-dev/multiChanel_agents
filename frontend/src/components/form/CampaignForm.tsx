"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CardSection } from "@/components/ui/CardSection";
import { Input } from "@/components/ui/Input";
import { Panel } from "@/components/ui/Panel";
import { Textarea } from "@/components/ui/Textarea";
import type { AnalyzeRequest, Channel } from "@/types/api";

const channels: Channel[] = ["TikTok", "Facebook", "Instagram", "X"];

const defaultValue: AnalyzeRequest = {
  topic: "summer food trends and viral dishes",
  articleUrl: "",
  businessType: "restaurant",
  targetAudience: "young professionals and food lovers aged 18-35",
  campaignGoal: "increase reservations and walk-in traffic",
  region: "North America",
  brandTone: "fun, trendy, and slightly playful",
 
  selectedChannels: ["TikTok", "Facebook", "Instagram", "X"],
  pastBrandContent: [],
};

type CampaignFormProps = {
  isSubmitting: boolean;
  error?: string | null;
  onSubmit: (value: AnalyzeRequest) => void;
};

export function CampaignForm({ isSubmitting, error, onSubmit }: CampaignFormProps) {
  const [form, setForm] = useState<AnalyzeRequest>(defaultValue);
  const [pastContent, setPastContent] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({
      ...form,
      pastBrandContent: pastContent
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Panel className="space-y-7">
        <CardSection
          title="Campaign Input"
          description="Start with one topic or article URL, then define the marketing context the AI workflow should optimize for."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Topic"
              value={form.topic}
              onChange={(event) => setForm((current) => ({ ...current, topic: event.target.value }))}
              placeholder="What should the campaign focus on?"
            />
            <Input
              label="Article URL"
              value={form.articleUrl ?? ""}
              onChange={(event) =>
                setForm((current) => ({ ...current, articleUrl: event.target.value }))
              }
              placeholder="https://example.com/article"
            />
            <Input
              label="Business Type"
              value={form.businessType}
              onChange={(event) =>
                setForm((current) => ({ ...current, businessType: event.target.value }))
              }
            />
            <Input
              label="Target Audience"
              value={form.targetAudience}
              onChange={(event) =>
                setForm((current) => ({ ...current, targetAudience: event.target.value }))
              }
            />
            <Input
              label="Campaign Goal"
              value={form.campaignGoal}
              onChange={(event) =>
                setForm((current) => ({ ...current, campaignGoal: event.target.value }))
              }
            />
            <Input
              label="Region"
              value={form.region}
              onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
            />
          </div>
          <Input
            label="Brand Tone"
            value={form.brandTone}
            onChange={(event) => setForm((current) => ({ ...current, brandTone: event.target.value }))}
          />
        </CardSection>
      </Panel>

      <Panel className="space-y-7">
        <CardSection
          title="Distribution & References"
          description="Select the channels to generate for and supply any past copy that should influence the voice profile."
        >
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {channels.map((channel) => {
              const selected = form.selectedChannels.includes(channel);

              return (
                <button
                  key={channel}
                  type="button"
                  className={`group rounded-[1.45rem] border px-4 py-4 text-left text-sm font-medium transition duration-200 ${
                    selected
                      ? "border-ember/20 bg-[linear-gradient(135deg,rgba(199,92,42,0.14),rgba(199,92,42,0.05))] text-ink shadow-[0_12px_24px_rgba(199,92,42,0.08)]"
                      : "border-white/70 bg-white/86 text-ink/72 hover:-translate-y-0.5 hover:border-ink/12 hover:bg-white"
                  }`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      selectedChannels: selected
                        ? current.selectedChannels.filter((item) => item !== channel)
                        : [...current.selectedChannels, channel],
                    }))
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{channel}</span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        selected
                          ? "border-ember/25 bg-ember text-white"
                          : "border-ink/10 bg-ink/[0.03] text-ink/45"
                      }`}
                    >
                      {selected ? "On" : "Off"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-ink/55">
                    Adapt strategy and copy for {channel === "X" ? "short-form threads" : channel}.
                  </p>
                </button>
              );
            })}
          </div>

          <Textarea
            label="Past Brand Content"
            value={pastContent}
            onChange={(event) => setPastContent(event.target.value)}
            placeholder="Paste prior examples, one per line, to influence tone and vocabulary."
          />
        </CardSection>
      </Panel>

      {error ? (
        <Panel className="border-red-200 bg-red-50/90 text-red-700">
          <p className="font-medium">Analysis request failed</p>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </Panel>
      ) : null}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Button type="submit" disabled={isSubmitting} className="md:min-w-64 md:w-auto">
          {isSubmitting ? "Analyzing campaign..." : "Generate Analysis"}
        </Button>
        <p className="max-w-xl text-sm leading-7 text-ink/60">
          The result includes trend scoring, brand voice, strategy, content outputs, image prompts, and QA review.
        </p>
      </div>
    </form>
  );
}
