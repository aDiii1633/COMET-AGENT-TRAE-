import { ArrowRight, CheckCircle2 } from "lucide-react";

export function FooterCta() {
  return (
    <section id="cta" className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-12">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(111,255,233,0.12),rgba(255,255,255,0.04))] p-8 sm:p-10 lg:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs tracking-[0.3em] text-cyan-100/70 uppercase">
              Ready to launch
            </p>
            <h2 className="max-w-3xl font-serif text-4xl text-white sm:text-5xl">
              Give every startup idea a sharper first move.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              COMET AGENT brings the research deck, roadmap, messaging system,
              build plan, and pitch story together in one premium flow.
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-white/12 bg-black/25 p-6">
            <div className="space-y-4 text-sm text-zinc-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-100" />
                Unlimited prompt explorations with dummy output preview
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-100" />
                Founder-focused workflow from validation to pitch
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-cyan-100" />
                Premium reporting surfaces designed for SaaS credibility
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-cyan-200 px-5 text-sm font-semibold text-zinc-950 transition hover:bg-white">
                Start free preview
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm text-white transition hover:bg-white/[0.08]">
                View product brief
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>COMET AGENT</p>
          <div className="flex flex-wrap gap-4">
            <a className="transition hover:text-white" href="#workflow">
              Workflow
            </a>
            <a className="transition hover:text-white" href="#results">
              Results
            </a>
            <a className="transition hover:text-white" href="#">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
