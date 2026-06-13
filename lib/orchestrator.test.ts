import assert from "node:assert/strict";
import test from "node:test";

import { runOrchestrator } from "./orchestrator.ts";

test("runOrchestrator executes agents in sequence and returns the combined output", async () => {
  const calls: string[] = [];

  const research = {
    competitors: ["Alpha"],
    targetAudience: ["Founders"],
    marketOpportunity: "Large and growing",
    industryTrends: ["AI agents"],
    challenges: ["Trust"],
    recommendations: ["Start narrow"],
  };

  const strategy = {
    businessName: "COMET AGENT",
    tagline: "Orchestrate startup execution",
    usp: "Five startup agents in one workflow",
    revenueModel: ["Subscription"],
    pricingStrategy: "Tiered plans",
    growthStrategy: ["Communities"],
    launchPlan: ["Private beta"],
  };

  const content = {
    blogIdeas: Array.from({ length: 10 }, (_, index) => `Blog ${index + 1}`),
    linkedinPosts: Array.from({ length: 10 }, (_, index) => `LinkedIn ${index + 1}`),
    twitterPosts: Array.from({ length: 10 }, (_, index) => `Twitter ${index + 1}`),
    newsletterTopics: Array.from(
      { length: 10 },
      (_, index) => `Newsletter ${index + 1}`
    ),
    youtubeIdeas: Array.from({ length: 10 }, (_, index) => `YouTube ${index + 1}`),
  };

  const development = {
    heroHeadline: "Ship your startup system faster.",
    heroSubheading: "COMET AGENT turns raw ideas into execution plans.",
    features: ["Research", "Strategy", "Content"],
    cta: "Run the workflow",
    pricingSection: "Start free",
    techStack: ["Next.js", "TypeScript"],
    mvpFeatures: ["Prompt input", "Agent outputs"],
  };

  const pitch = {
    problem: "Founders waste time stitching startup work together.",
    solution: "COMET AGENT runs the workflow in one place.",
    market: "Fast-growing startup tooling demand.",
    businessModel: "Subscription SaaS",
    competitiveAdvantage: "Connected agent handoffs",
    futureVision: "Become the execution layer for AI-native startups.",
  };

  const result = await runOrchestrator("Build an AI CFO for founders", {
    runResearchAgent: async (userGoal) => {
      calls.push("research");
      assert.equal(userGoal, "Build an AI CFO for founders");
      return research;
    },
    runStrategyAgent: async (input) => {
      calls.push("strategy");
      assert.equal(input.businessIdea, "Build an AI CFO for founders");
      assert.deepEqual(input.researchOutput, research);
      return strategy;
    },
    runContentAgent: async (input) => {
      calls.push("content");
      assert.equal(input.businessIdea, "Build an AI CFO for founders");
      assert.deepEqual(input.strategyOutput, strategy);
      return content;
    },
    runDevelopmentAgent: async (input) => {
      calls.push("development");
      assert.equal(input.businessIdea, "Build an AI CFO for founders");
      assert.deepEqual(input.strategyOutput, strategy);
      return development;
    },
    runPitchAgent: async (input) => {
      calls.push("pitch");
      assert.deepEqual(input.researchOutput, research);
      assert.deepEqual(input.strategyOutput, strategy);
      assert.deepEqual(input.contentOutput, content);
      assert.deepEqual(input.developmentOutput, development);
      return pitch;
    },
  });

  assert.deepEqual(calls, [
    "research",
    "strategy",
    "content",
    "development",
    "pitch",
  ]);
  assert.deepEqual(result, {
    research,
    strategy,
    content,
    development,
    pitch,
  });
});

test("runOrchestrator rejects blank user goals", async () => {
  await assert.rejects(() => runOrchestrator("   "), /User goal is required/);
});
