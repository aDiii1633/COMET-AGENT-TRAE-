import { Download, Sparkles } from "lucide-react";

import type { OrchestratorOutput } from "@/lib/orchestrator";

type ResultsSectionProps = {
  prompt: string;
  results: OrchestratorOutput | null;
  error: string | null;
  isGenerating: boolean;
  onExport: () => void;
};

type DetailBlockProps = {
  title: string;
  items?: string[];
  text?: string;
};

function DetailBlock({ title, items, text }: DetailBlockProps) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
      <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">{title}</p>
      {text ? (
        <p className="mt-3 text-sm leading-7 text-zinc-300">{text}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {items?.map((item) => (
            <div
              key={item}
              className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm leading-6 text-zinc-300"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultsSection({
  prompt,
  results,
  error,
  isGenerating,
  onExport,
}: ResultsSectionProps) {
  return (
    <section id="results" className="border-y border-white/10 bg-black/20">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
        <div className="grid gap-10">
          <div className="space-y-5">
            <p className="text-xs tracking-[0.3em] text-cyan-100/70 uppercase">
              Results
            </p>
            <h2 className="font-serif text-4xl text-white sm:text-5xl">
              Combined startup outputs, ready to review or export.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              COMET AGENT combines the outputs from research, strategy, content,
              development, and pitch into one startup plan.
            </p>

            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div className="rounded-[1.75rem] border border-cyan-200/15 bg-cyan-300/10 p-5">
                <div className="flex items-center gap-2 text-xs tracking-[0.26em] text-cyan-100 uppercase">
                  <Sparkles className="h-4 w-4" />
                  Active prompt
                </div>
                <p className="mt-4 text-base leading-8 text-white">{prompt}</p>
              </div>
              <button
                type="button"
                onClick={onExport}
                disabled={!results || isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium text-white transition hover:border-cyan-200/30 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export to Markdown
              </button>
            </div>
          </div>

          {error ? (
            <div className="rounded-[1.75rem] border border-rose-300/20 bg-rose-300/10 p-5 text-sm leading-7 text-rose-100">
              {error}
            </div>
          ) : null}

          {!results && !error ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-8 text-sm leading-7 text-zinc-400">
              {isGenerating
                ? "Generating your startup plan..."
                : "Run the workflow to generate research, strategy, content, development, and pitch results."}
            </div>
          ) : null}

          {results ? (
            <div className="grid gap-5">
              <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                  Research Results
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <DetailBlock
                    title="Competitors"
                    items={results.research.competitors}
                  />
                  <DetailBlock
                    title="Target Audience"
                    items={results.research.targetAudience}
                  />
                  <DetailBlock
                    title="Market Opportunity"
                    text={results.research.marketOpportunity}
                  />
                  <DetailBlock
                    title="Industry Trends"
                    items={results.research.industryTrends}
                  />
                  <DetailBlock
                    title="Challenges"
                    items={results.research.challenges}
                  />
                  <DetailBlock
                    title="Recommendations"
                    items={results.research.recommendations}
                  />
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                  Strategy Results
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <DetailBlock title="Business Name" text={results.strategy.businessName} />
                  <DetailBlock title="Tagline" text={results.strategy.tagline} />
                  <DetailBlock title="USP" text={results.strategy.usp} />
                  <DetailBlock
                    title="Revenue Model"
                    items={results.strategy.revenueModel}
                  />
                  <DetailBlock
                    title="Pricing Strategy"
                    text={results.strategy.pricingStrategy}
                  />
                  <DetailBlock
                    title="Growth Strategy"
                    items={results.strategy.growthStrategy}
                  />
                  <DetailBlock
                    title="Launch Plan"
                    items={results.strategy.launchPlan}
                  />
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                  Content Results
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <DetailBlock title="Blog Ideas" items={results.content.blogIdeas} />
                  <DetailBlock
                    title="LinkedIn Posts"
                    items={results.content.linkedinPosts}
                  />
                  <DetailBlock
                    title="Twitter Posts"
                    items={results.content.twitterPosts}
                  />
                  <DetailBlock
                    title="Newsletter Topics"
                    items={results.content.newsletterTopics}
                  />
                  <DetailBlock
                    title="YouTube Ideas"
                    items={results.content.youtubeIdeas}
                  />
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                  Development Results
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <DetailBlock
                    title="Hero Headline"
                    text={results.development.heroHeadline}
                  />
                  <DetailBlock
                    title="Hero Subheading"
                    text={results.development.heroSubheading}
                  />
                  <DetailBlock
                    title="Features"
                    items={results.development.features}
                  />
                  <DetailBlock title="CTA" text={results.development.cta} />
                  <DetailBlock
                    title="Pricing Section"
                    text={results.development.pricingSection}
                  />
                  <DetailBlock
                    title="Tech Stack"
                    items={results.development.techStack}
                  />
                  <DetailBlock
                    title="MVP Features"
                    items={results.development.mvpFeatures}
                  />
                </div>
              </article>

              <article className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6">
                <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                  Pitch Results
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <DetailBlock title="Problem" text={results.pitch.problem} />
                  <DetailBlock title="Solution" text={results.pitch.solution} />
                  <DetailBlock title="Market" text={results.pitch.market} />
                  <DetailBlock
                    title="Business Model"
                    text={results.pitch.businessModel}
                  />
                  <DetailBlock
                    title="Competitive Advantage"
                    text={results.pitch.competitiveAdvantage}
                  />
                  <DetailBlock
                    title="Future Vision"
                    text={results.pitch.futureVision}
                  />
                </div>
              </article>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
