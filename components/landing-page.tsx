"use client";

import { useState } from "react";

import { FooterCta } from "@/components/sections/footer-cta";
import { HeroSection } from "@/components/sections/hero-section";
import { ResultsSection } from "@/components/sections/results-section";
import { WorkflowSection } from "@/components/sections/workflow-section";
import type { OrchestratorOutput } from "@/lib/orchestrator";
import { buildStartupPlanMarkdown } from "@/lib/startup-plan-markdown";
import {
  type AgentRuntimeStatus,
  defaultPrompt,
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
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, AgentRuntimeStatus>>(
    createQueuedStatuses
  );

  const animateWorkflow = async () => {
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
  };

  const handlePromptSubmit = async () => {
    if (isGenerating) {
      return;
    }

    const nextPrompt = prompt.trim() || defaultPrompt;

    setPrompt(nextPrompt);
    setSubmittedPrompt(nextPrompt);
    setIsGenerating(true);
    setError(null);
    setStatuses(createQueuedStatuses());

    const workflowSection = document.getElementById("workflow");
    workflowSection?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const requestPromise = fetch("/api/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: nextPrompt }),
      }).then(async (response) => {
        const body = (await response.json()) as unknown;

        if (
          !response.ok ||
          typeof body !== "object" ||
          body === null ||
          !("research" in body)
        ) {
          const message =
            typeof body === "object" &&
            body !== null &&
            "error" in body &&
            typeof body.error === "string"
              ? body.error
              : "Failed to generate the startup plan.";

          throw new Error(message);
        }

        return body as OrchestratorOutput;
      });

      const [orchestratedResults] = await Promise.all([
        requestPromise,
        animateWorkflow(),
      ]);

      setResults(orchestratedResults);

      const resultsSection = document.getElementById("results");
      resultsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (caughtError) {
      setResults(null);
      setStatuses(createQueuedStatuses());
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to generate the startup plan."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!results) {
      return;
    }

    const markdown = buildStartupPlanMarkdown(submittedPrompt, results);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "startup-plan.md";
    link.click();
    URL.revokeObjectURL(url);
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
        <ResultsSection
          prompt={submittedPrompt}
          results={results}
          error={error}
          isGenerating={isGenerating}
          onExport={handleExport}
        />
        <FooterCta />
      </div>
    </main>
  );
}
