import { CheckCircle2, CircleDot, LoaderCircle } from "lucide-react";

import type { AgentRuntimeStatus, AgentStep } from "@/lib/site-data";

type WorkflowSectionProps = {
  steps: AgentStep[];
  statuses: Record<string, AgentRuntimeStatus>;
  isGenerating: boolean;
};

export function WorkflowSection({
  steps,
  statuses,
  isGenerating,
}: WorkflowSectionProps) {
  return (
    <section
      id="workflow"
      className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-10 lg:px-12"
    >
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <p className="text-xs tracking-[0.3em] text-cyan-100/70 uppercase">
            Workflow
          </p>
          <h2 className="max-w-3xl font-serif text-4xl text-white sm:text-5xl">
            Five specialized agents push every idea toward launch readiness.
          </h2>
          <p className="text-sm leading-7 text-zinc-400">
            Click Generate to watch the workflow animate in sequence with fake
            client-side execution.
          </p>
        </div>
        <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
          Each step is tuned for founder decisions: validate the market, frame
          the wedge, write the story, scope the product, and package the pitch.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = statuses[step.id] ?? "Queued";
          const statusAccent =
            status === "Completed"
              ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-100"
              : status === "Loading"
                ? "border-cyan-200/25 bg-cyan-300/10 text-cyan-100"
                : "border-white/10 bg-white/[0.04] text-zinc-300";
          const statusIcon =
            status === "Completed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : status === "Loading" ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <CircleDot className="h-4 w-4" />
            );
          const cardAccent =
            status === "Completed"
              ? "hover:border-emerald-200/35"
              : status === "Loading"
                ? "border-cyan-200/30 shadow-[0_20px_90px_-60px_rgba(111,255,233,0.6)] hover:border-cyan-200/35"
                : "hover:border-cyan-200/30";

          return (
            <article
              key={step.id}
              className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:bg-white/[0.06] ${cardAccent}`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent transition ${
                  status === "Completed"
                    ? "via-emerald-200/70 opacity-100"
                    : status === "Loading"
                      ? "via-cyan-200/80 opacity-100"
                      : "via-cyan-200/60 opacity-0 group-hover:opacity-100"
                }`}
              />
              <div className="mb-10 flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-cyan-100">
                  <Icon className="h-5 w-5" />
                </div>
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${statusAccent}`}
                >
                  {statusIcon}
                  {status}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs tracking-[0.28em] text-zinc-500 uppercase">
                  Step {index + 1}
                </p>
                <h3 className="text-xl font-semibold text-white">{step.name}</h3>
                <p className="text-sm leading-7 text-zinc-300">{step.summary}</p>
                <p className="text-sm leading-7 text-zinc-500">{step.detail}</p>
              </div>

              <div className="mt-6 h-1.5 rounded-full bg-white/5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    status === "Completed"
                      ? "w-full bg-emerald-200"
                      : status === "Loading"
                        ? "w-2/3 bg-cyan-200"
                        : "w-1/6 bg-zinc-600"
                  }`}
                />
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-zinc-400">
        <span>
          {isGenerating
            ? "Agents are processing your prompt in order."
            : "The workflow is idle until you trigger a new generation."}
        </span>
        <span className="text-zinc-500">
          {Object.values(statuses).filter((status) => status === "Completed").length}
          /{steps.length} completed
        </span>
      </div>
    </section>
  );
}
