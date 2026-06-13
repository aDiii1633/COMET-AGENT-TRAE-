"use client";

import { useState } from "react";

import { FooterCta } from "@/components/sections/footer-cta";
import { HeroSection } from "@/components/sections/hero-section";
import { ResultsSection } from "@/components/sections/results-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import {
  type AgentRuntimeStatus,
  defaultPrompt,
  resultCards,
  statHighlights,
  trustItems,
  workflowSteps,
} from "@/lib/site-data";

const runtimeDelay = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const createQueuedStatuses = (): Record<string, AgentRuntimeStatus> =>
  Object.fromEntries(workflowSteps.map((step) => [step.id, "Queued"]));

export function LandingPage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [submittedPrompt, setSubmittedPrompt] = useState(defaultPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, AgentRuntimeStatus>>(
    createQueuedStatuses
  );

  const handlePromptSubmit = async () => {
    if (isGenerating) {
      return;
    }

    const nextPrompt = prompt.trim() || defaultPrompt;

    setPrompt(nextPrompt);
    setSubmittedPrompt(nextPrompt);
    setIsGenerating(true);
    setStatuses(createQueuedStatuses());

    const workflowSection = document.getElementById("workflow");
    workflowSection?.scrollIntoView({ behavior: "smooth", block: "start" });

    for (const step of workflowSteps) {
      setStatuses((current) => ({
        ...current,
        [step.id]: "Loading",
      }));
      await runtimeDelay(950);

      setStatuses((current) => ({
        ...current,
        [step.id]: "Completed",
      }));
      await runtimeDelay(350);
    }

    setIsGenerating(false);

    const resultsSection = document.getElementById("results");
    resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--foreground)]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(111,255,233,0.16),transparent_22%)]" />

      <div className="relative">
        <HeroSection
          prompt={prompt}
          onPromptChange={setPrompt}
          onPromptSubmit={handlePromptSubmit}
          trustItems={trustItems}
          statHighlights={statHighlights}
          isGenerating={isGenerating}
        />
        <WorkflowSection
          steps={workflowSteps}
          statuses={statuses}
          isGenerating={isGenerating}
        />
        <ResultsSection prompt={submittedPrompt} cards={resultCards} />
        <FooterCta />
      </div>
    </main>
  );
}
