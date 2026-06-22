import { ArrowRight, Sparkles } from "lucide-react";

type HeroSectionProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onPromptSubmit: () => void;
  trustItems: string[];
  statHighlights: Array<{ label: string; value: string }>;
  isGenerating: boolean;
};

export function HeroSection({
  prompt,
  onPromptChange,
  onPromptSubmit,
  trustItems,
  statHighlights,
  isGenerating,
}: HeroSectionProps) {
  return (
    <section className="border-b border-white/10">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-black">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] text-cyan-100 uppercase">
              COMET AGENT
            </p>
            <p className="text-sm text-zinc-400">AI startup execution system</p>
          </div>
        </div>

        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs tracking-[0.26em] text-cyan-100 uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Prompt Box
          </div>

          <div className="space-y-5">
            <h1 className="font-serif text-5xl text-white sm:text-6xl lg:text-7xl">
              Turn one startup idea into research, strategy, content, product, and pitch.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-zinc-300 sm:text-lg">
              COMET AGENT orchestrates five specialized Gemini-powered agents to
              generate a complete startup plan with a premium, founder-ready workflow.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-cyan-950/20">
            <div className="flex flex-col gap-3 lg:flex-row">
              <textarea
                value={prompt}
                onChange={(event) => onPromptChange(event.target.value)}
                disabled={isGenerating}
                placeholder="Describe the startup you want COMET AGENT to plan, position, and ship"
                rows={3}
                className="min-h-[88px] flex-1 resize-none rounded-[1.4rem] border border-white/10 bg-black/20 px-5 py-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-cyan-300/30"
              />
              <button
                type="button"
                onClick={onPromptSubmit}
                disabled={isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-[1.4rem] bg-cyan-300 px-6 py-4 text-sm font-semibold text-black transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60 lg:self-stretch"
              >
                {isGenerating ? "Generating..." : "Generate Plan"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {statHighlights.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-xs tracking-[0.24em] text-zinc-500 uppercase">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
