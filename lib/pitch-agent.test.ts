import assert from "node:assert/strict";
import test from "node:test";

import { createPitchAgentPrompt, parsePitchAgentResponse } from "./pitch-agent.ts";

const researchOutput = {
  competitors: ["QuickBooks", "Wave"],
  targetAudience: ["Solo founders", "Freelancers"],
  marketOpportunity: "There is strong demand for simpler finance tooling.",
  industryTrends: ["AI automation", "Embedded finance"],
  challenges: ["Trust", "Accuracy"],
  recommendations: ["Focus on ease of use", "Start with a niche"],
};

const strategyOutput = {
  businessName: "COMET AGENT",
  tagline: "Finance clarity for solo builders.",
  usp: "AI-native bookkeeping built for solo founders.",
  revenueModel: ["Subscription", "Add-on services"],
  pricingStrategy: "Tiered monthly pricing.",
  growthStrategy: ["Founder communities", "Partnerships"],
  launchPlan: ["Waitlist", "Private beta", "Public launch"],
};

const contentOutput = {
  blogIdeas: Array.from({ length: 10 }, (_, index) => `Blog ${index + 1}`),
  linkedinPosts: Array.from({ length: 10 }, (_, index) => `LinkedIn ${index + 1}`),
  twitterPosts: Array.from({ length: 10 }, (_, index) => `Twitter ${index + 1}`),
  newsletterTopics: Array.from(
    { length: 10 },
    (_, index) => `Newsletter ${index + 1}`
  ),
  youtubeIdeas: Array.from({ length: 10 }, (_, index) => `YouTube ${index + 1}`),
};

const developmentOutput = {
  heroHeadline: "Build your startup finance system in one prompt.",
  heroSubheading: "COMET AGENT turns bookkeeping chaos into founder-ready clarity.",
  features: ["Automated categorization", "Runway insights", "Weekly reports"],
  cta: "Start planning your finance stack",
  pricingSection: "Founder-friendly tiered plans.",
  techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
  mvpFeatures: ["Prompt intake", "Dashboard", "Summary reports"],
};

test("createPitchAgentPrompt includes all prior outputs and schema", () => {
  const prompt = createPitchAgentPrompt({
    researchOutput,
    strategyOutput,
    contentOutput,
    developmentOutput,
  });

  assert.match(prompt, /Research Output:/);
  assert.match(prompt, /Strategy Output:/);
  assert.match(prompt, /Content Output:/);
  assert.match(prompt, /Development Output:/);
  assert.match(prompt, /"problem": ""/);
  assert.match(prompt, /"futureVision": ""/);
});

test("parsePitchAgentResponse accepts valid JSON output", () => {
  const result = parsePitchAgentResponse(`{
    "problem": "Solo founders struggle with bookkeeping complexity and low visibility.",
    "solution": "COMET AGENT automates bookkeeping and explains finances in founder language.",
    "market": "A growing base of solo operators needs simple finance tooling.",
    "businessModel": "Recurring SaaS subscriptions with expansion add-ons.",
    "competitiveAdvantage": "Vertical AI focus on solo-founder finance workflows.",
    "futureVision": "Become the financial operating system for one-person startups."
  }`);

  assert.equal(
    result.problem,
    "Solo founders struggle with bookkeeping complexity and low visibility."
  );
  assert.equal(
    result.futureVision,
    "Become the financial operating system for one-person startups."
  );
});

test("parsePitchAgentResponse rejects invalid shapes", () => {
  assert.throws(
    () =>
      parsePitchAgentResponse(`{
        "problem": "",
        "solution": "",
        "market": "",
        "businessModel": [],
        "competitiveAdvantage": "",
        "futureVision": ""
      }`),
    /businessModel/
  );
});
