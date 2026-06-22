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

const createCompletedStatuses = (): Record<string, AgentRuntimeStatus> =>
  Object.fromEntries(workflowSteps.map((step) => [step.id, "Completed"]));

const demoResults: OrchestratorOutput = {
  research: {
    competitors: [
      "Indie Hackers communities and templates",
      "Notion startup planning dashboards",
      "Generic AI business plan generators",
      "Founder CRM and validation tools",
    ],
    targetAudience: [
      "Solo founders validating new SaaS ideas",
      "Early-stage startup teams preparing launches",
      "Agencies packaging go-to-market strategy for clients",
      "Accelerator founders building investor-ready materials",
    ],
    marketOpportunity:
      "COMET AGENT can win by combining research, strategy, content, development planning, and pitch creation in one premium execution flow instead of forcing founders to stitch together five separate tools.",
    industryTrends: [
      "Founders are replacing fragmented productivity stacks with AI-native workflows.",
      "Prompt-to-output startup tooling is moving from experiments to operator-grade products.",
      "Investors increasingly expect faster validation and clearer launch narratives.",
      "Small teams favor products that compress strategy and execution into one interface.",
    ],
    challenges: [
      "AI outputs can feel generic without domain-aware orchestration.",
      "Many startup tools stop at ideation and do not support execution handoff.",
      "Users expect polished export-ready deliverables, not raw text dumps.",
    ],
    recommendations: [
      "Lead with the all-in-one founder workflow instead of individual agent features.",
      "Show visible proof across research, strategy, content, build, and pitch on first load.",
      "Keep exports and structured sections easy to scan for founders and investors.",
    ],
  },
  strategy: {
    businessName: "COMET AGENT",
    tagline: "Your AI workforce for turning startup ideas into execution.",
    usp: "A single command center that turns one startup prompt into research, positioning, launch content, build scope, and an investor-ready pitch.",
    revenueModel: [
      "Monthly subscription for founders and startup teams",
      "Agency plan for multi-client workspace management",
      "Premium export and investor-deck packaging upsell",
    ],
    pricingStrategy:
      "Use a premium self-serve tier for solo founders, a team tier for operators, and a higher-touch agency tier with collaboration and branded exports.",
    growthStrategy: [
      "Acquire founder communities with visible end-to-end demo plans.",
      "Publish viral before-and-after startup transformation content.",
      "Use the exported markdown plan as a built-in referral loop.",
    ],
    launchPlan: [
      "Ship a polished landing page with visible default data and workflow proof.",
      "Open beta for solo founders and collect result quality feedback.",
      "Expand into team collaboration and investor export flows.",
    ],
  },
  content: {
    blogIdeas: [
      {
        content: "How solo founders can replace five startup tools with one AI execution workflow.",
        hashtags: ["#StartupOps", "#AIFounders"],
        engagementScore: 88,
        characterCount: 83,
      },
      {
        content: "The fastest way to go from startup idea to investor-ready plan.",
        hashtags: ["#LaunchStrategy", "#FounderTools"],
        engagementScore: 85,
        characterCount: 68,
      },
    ],
    linkedinPosts: [
      {
        content: "Most founders do not need more tools. They need one workflow that turns an idea into execution.",
        hashtags: ["#B2BStartup", "#FounderExecution"],
        engagementScore: 90,
        characterCount: 98,
      },
      {
        content: "COMET AGENT helps founders move from research to pitch without losing context between stages.",
        hashtags: ["#StartupStrategy", "#AIAutomation"],
        engagementScore: 87,
        characterCount: 102,
      },
    ],
    twitterPosts: [
      {
        content: "One prompt. Five agents. A complete startup plan.",
        hashtags: ["#buildinpublic", "#saas"],
        engagementScore: 91,
        characterCount: 49,
      },
      {
        content: "Research -> strategy -> content -> product -> pitch. That is the workflow founders actually need.",
        hashtags: ["#founders", "#aiagents"],
        engagementScore: 89,
        characterCount: 97,
      },
    ],
    newsletterTopics: [
      {
        content: "Why execution-focused AI tools will beat idea-only startup generators.",
        hashtags: ["#newsletter", "#startupbrief"],
        engagementScore: 83,
        characterCount: 73,
      },
      {
        content: "The new founder stack: less context-switching, more launch velocity.",
        hashtags: ["#operatornotes", "#gtm"],
        engagementScore: 81,
        characterCount: 68,
      },
    ],
    instagramIdeas: [
      {
        content: "Carousel: from messy startup idea to launch-ready roadmap in five agent steps.",
        hashtags: ["#startupdesign", "#founderjourney"],
        engagementScore: 86,
        characterCount: 78,
      },
    ],
    youtubeIdeas: [
      {
        content: "Watch an AI startup copilot turn one prompt into a full business plan.",
        hashtags: ["#aitools", "#startupbuild"],
        engagementScore: 92,
        characterCount: 73,
      },
    ],
    facebookPosts: [
      {
        content: "If you are validating a startup idea, you should see the research, launch strategy, and pitch in one place.",
        hashtags: ["#foundercommunity", "#launchsmarter"],
        engagementScore: 79,
        characterCount: 108,
      },
    ],
  },
  development: {
    productArchitecture:
      "A Next.js application with a prompt-driven workspace, orchestrated AI agent pipeline, export tooling, and modular result dashboards for each startup execution stage.",
    techStack: [
      { name: "Next.js 15", category: "Frontend App" },
      { name: "TypeScript", category: "Type Safety" },
      { name: "Tailwind CSS", category: "Styling" },
      { name: "Gemini", category: "AI Model" },
      { name: "Vercel", category: "Deployment" },
    ],
    kanbanRoadmap: {
      now: [
        { task: "Polish the full-page workspace experience", priority: "High" },
        { task: "Expose structured startup outputs clearly", priority: "High" },
      ],
      next: [
        { task: "Add richer exports and collaboration", priority: "Medium" },
      ],
      later: [
        { task: "Add saved plans and project history", priority: "Low" },
      ],
    },
    mvpFeatures: [
      {
        name: "Prompt-to-plan workflow",
        description: "Generate research, strategy, content, development, and pitch outputs from one input.",
      },
      {
        name: "Workflow timeline",
        description: "Show progress across the five AI agents.",
      },
      {
        name: "Markdown export",
        description: "Download the full startup plan as a portable document.",
      },
    ],
    developmentTimeline: [
      { phase: "Week 1", duration: "5 days", goal: "Ship core prompt and orchestration flow" },
      { phase: "Week 2", duration: "5 days", goal: "Polish result views and exports" },
      { phase: "Week 3", duration: "5 days", goal: "Add collaboration and saved histories" },
    ],
    htmlLandingPage: "<!DOCTYPE html><html><body><h1>COMET AGENT</h1></body></html>",
  },
  pitch: {
    problem:
      "Founders lose momentum because research, positioning, content, build planning, and pitching are scattered across disconnected tools.",
    solution:
      "COMET AGENT unifies the full startup execution workflow into a single prompt-driven product.",
    market:
      "The product fits solo founders, startup studios, and lean teams who need speed, clarity, and investor-ready outputs.",
    businessModel:
      "Recurring SaaS revenue with founder, team, and agency tiers plus premium exports.",
    competitiveAdvantage:
      "The moat is continuity across all five execution stages, not just isolated AI generation.",
    futureVision:
      "Become the default operating system founders use to validate, launch, and present new ventures.",
  },
};

export function LandingPage() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [submittedPrompt, setSubmittedPrompt] = useState(defaultPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<OrchestratorOutput | null>(demoResults);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, AgentRuntimeStatus>>(
    createCompletedStatuses
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_26%)]" />

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
