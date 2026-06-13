"use client";

import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";

type HeroSectionProps = {
  prompt: string;
  onPromptChange: (value: string) => void;
  onPromptSubmit: () => void;
  trustItems: string[];
  statHighlights: { label: string; value: string }[];
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
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,255,233,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(126,154,255,0.22),transparent_25%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-12">
        <nav className="mb-16 flex items-center justify-between gap-6 rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-sm font-semibold text-cyan-100">
              SP
            </div>
            <div>
              <p className="text-sm tracking-[0.28em] text-zinc-400 uppercase">
                StartupPilot AI
              </p>
              <p className="text-xs text-zinc-500">Agentic startup execution</p>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a className="transition hover:text-white" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-white" href="#results">
              Results
            </a>
            <a className="transition hover:text-white" href="#cta">
              Pricing
            </a>
          </div>

          <button className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-sm text-white transition hover:border-cyan-200/40 hover:bg-white/12">
            Book a demo
          </button>
        </nav>

        <div className="grid flex-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-4 py-2 text-xs tracking-[0.26em] text-cyan-100 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Startup planning from a single prompt
            </div>

            <div className="space-y-6">
              <p className="max-w-xl font-serif text-5xl leading-none text-white sm:text-6xl lg:text-8xl">
                Turn one startup idea into a research-backed launch system.
              </p>
              <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                StartupPilot AI chains research, strategy, content, product,
                and pitch agents into one premium workflow built for founders
                who move fast and need signal, not noise.
              </p>
            </div>

            <form
              className="rounded-[2rem] border border-white/10 bg-zinc-950/80 p-4 shadow-[0_25px_120px_-50px_rgba(63,221,255,0.35)] backdrop-blur"
              onSubmit={(event) => {
                event.preventDefault();
                onPromptSubmit();
              }}
            >
              <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/8 bg-white/[0.04] p-3 md:flex-row md:items-center">
                <input
                  aria-label="Startup prompt"
                  className="h-14 flex-1 rounded-[1.2rem] border border-white/8 bg-black/20 px-5 text-base text-white outline-none transition placeholder:text-zinc-500 focus:border-cyan-200/40"
                  value={prompt}
                  onChange={(event) => onPromptChange(event.target.value)}
                  disabled={isGenerating}
                  placeholder="Describe the startup you want StartupPilot AI to build a plan for"
                />
                <button
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-[1.2rem] bg-cyan-200 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-cyan-200/70"
                  type="submit"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Run agents"}
                  {isGenerating ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-400">
                <span className="text-zinc-500">Try:</span>
                <button
                  className="rounded-full border border-white/10 px-3 py-1 transition hover:border-cyan-200/30 hover:text-white"
                  type="button"
                  disabled={isGenerating}
                  onClick={() =>
                    onPromptChange(
                      "Launch an AI analyst for Shopify brands that predicts churn and recommends recovery plays."
                    )
                  }
                >
                  AI analyst for Shopify brands
                </button>
                <button
                  className="rounded-full border border-white/10 px-3 py-1 transition hover:border-cyan-200/30 hover:text-white"
                  type="button"
                  disabled={isGenerating}
                  onClick={() =>
                    onPromptChange(
                      "Build a workflow copilot that helps agencies scope projects, price retainers, and package proposals."
                    )
                  }
                >
                  Workflow copilot for agencies
                </button>
              </div>
            </form>

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
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-cyan-200/15 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.05] p-6 shadow-2xl backdrop-blur">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
                    Live orchestration
                  </p>
                  <p className="mt-2 font-serif text-3xl text-white">
                    Founder cockpit
                  </p>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                  5 agents online
                </div>
              </div>

              <div className="space-y-4">
                {statHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.4rem] border border-white/10 bg-zinc-950/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm text-zinc-400">{item.label}</p>
                      <p className="text-2xl font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/5">
                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-200 via-teal-200 to-emerald-200" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/30 p-5">
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">
                  Forecast summary
                </p>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Research confidence is high, strategy synthesis is in motion,
                  and the output stack is shaping a founder-ready launch plan
                  with messaging, build tasks, and investor storylines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
