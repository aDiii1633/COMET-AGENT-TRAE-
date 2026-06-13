import { ArrowUpRight, Sparkles } from "lucide-react";

import type { ResultCard } from "@/lib/site-data";

type ResultsSectionProps = {
  prompt: string;
  cards: ResultCard[];
};

export function ResultsSection({ prompt, cards }: ResultsSectionProps) {
  return (
    <section id="results" className="border-y border-white/10 bg-black/20">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="text-xs tracking-[0.3em] text-cyan-100/70 uppercase">
              Results
            </p>
            <h2 className="font-serif text-4xl text-white sm:text-5xl">
              Instant output that looks ready for a founder war room.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              StartupPilot AI keeps the experience tangible by showing what each
              agent would produce from the active prompt, using dummy data only.
            </p>

            <div className="rounded-[1.75rem] border border-cyan-200/15 bg-cyan-300/10 p-5">
              <div className="flex items-center gap-2 text-xs tracking-[0.26em] text-cyan-100 uppercase">
                <Sparkles className="h-4 w-4" />
                Active prompt
              </div>
              <p className="mt-4 text-base leading-8 text-white">{prompt}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <article
                key={card.id}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-200/25 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.26em] text-zinc-500 uppercase">
                      {card.label}
                    </p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">
                      {card.title}
                    </h3>
                  </div>
                  <ArrowUpRight className="mt-1 h-5 w-5 text-zinc-500" />
                </div>

                <div className="mt-5 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                  {card.metric}
                </div>

                <div className="mt-6 space-y-3">
                  {card.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm leading-7 text-zinc-300"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
