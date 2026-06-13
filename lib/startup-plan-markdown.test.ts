import assert from "node:assert/strict";
import test from "node:test";

import { buildStartupPlanMarkdown } from "./startup-plan-markdown.ts";

test("buildStartupPlanMarkdown combines all agent outputs into one markdown document", () => {
  const markdown = buildStartupPlanMarkdown("Build an AI CFO for founders", {
    research: {
      competitors: ["Alpha", "Beta"],
      targetAudience: ["Founders"],
      marketOpportunity: "Large and growing",
      industryTrends: ["AI agents"],
      challenges: ["Trust"],
      recommendations: ["Start narrow"],
    },
    strategy: {
      businessName: "COMET AGENT",
      tagline: "Orchestrate startup execution",
      usp: "Five startup agents in one workflow",
      revenueModel: ["Subscription"],
      pricingStrategy: "Tiered plans",
      growthStrategy: ["Communities"],
      launchPlan: ["Private beta"],
    },
    content: {
      blogIdeas: Array.from({ length: 10 }, (_, index) => `Blog ${index + 1}`),
      linkedinPosts: Array.from({ length: 10 }, (_, index) => `LinkedIn ${index + 1}`),
      twitterPosts: Array.from({ length: 10 }, (_, index) => `Twitter ${index + 1}`),
      newsletterTopics: Array.from(
        { length: 10 },
        (_, index) => `Newsletter ${index + 1}`
      ),
      youtubeIdeas: Array.from({ length: 10 }, (_, index) => `YouTube ${index + 1}`),
    },
    development: {
      heroHeadline: "Ship your startup system faster.",
      heroSubheading: "COMET AGENT turns raw ideas into execution plans.",
      features: ["Research", "Strategy"],
      cta: "Run the workflow",
      pricingSection: "Starter plan",
      techStack: ["Next.js", "TypeScript"],
      mvpFeatures: ["Prompt input", "Agent outputs"],
    },
    pitch: {
      problem: "Fragmented execution",
      solution: "Unified orchestration",
      market: "Growing startup tooling demand",
      businessModel: "Subscription SaaS",
      competitiveAdvantage: "Connected agent handoffs",
      futureVision: "Become the execution layer for AI-native startups.",
    },
  });

  assert.match(markdown, /# startup-plan/);
  assert.match(markdown, /## Research Results/);
  assert.match(markdown, /## Strategy Results/);
  assert.match(markdown, /## Content Results/);
  assert.match(markdown, /## Development Results/);
  assert.match(markdown, /## Pitch Results/);
  assert.match(markdown, /Build an AI CFO for founders/);
  assert.match(markdown, /- Alpha/);
  assert.match(markdown, /COMET AGENT/);
});
