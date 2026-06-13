import assert from "node:assert/strict";
import test from "node:test";

import {
  createDevelopmentAgentPrompt,
  parseDevelopmentAgentResponse,
} from "./development-agent.ts";

const strategyOutput = {
  businessName: "COMET AGENT",
  tagline: "Finance clarity for solo builders.",
  usp: "AI-native bookkeeping built for solo founders.",
  revenueModel: ["Subscription", "Add-on services"],
  pricingStrategy: "Tiered monthly pricing.",
  growthStrategy: ["Founder communities", "Partnerships"],
  launchPlan: ["Waitlist", "Private beta", "Public launch"],
};

test("createDevelopmentAgentPrompt includes business idea, strategy output, and schema", () => {
  const prompt = createDevelopmentAgentPrompt({
    businessIdea: "AI bookkeeping copilot for solo founders",
    strategyOutput,
  });

  assert.match(prompt, /Business Idea:/);
  assert.match(prompt, /Strategy Output:/);
  assert.match(prompt, /AI bookkeeping copilot for solo founders/);
  assert.match(prompt, /"businessName": "COMET AGENT"/);
  assert.match(prompt, /"heroHeadline": ""/);
  assert.match(prompt, /"mvpFeatures": \[\]/);
});

test("parseDevelopmentAgentResponse accepts valid JSON output", () => {
  const result = parseDevelopmentAgentResponse(`{
    "heroHeadline": "Build your startup finance system in one prompt.",
    "heroSubheading": "COMET AGENT turns bookkeeping chaos into founder-ready clarity.",
    "features": ["Automated categorization", "Runway insights", "Weekly reports"],
    "cta": "Start planning your finance stack",
    "pricingSection": "Start with a free trial, then move to a monthly founder plan.",
    "techStack": ["Next.js", "TypeScript", "Tailwind CSS"],
    "mvpFeatures": ["Prompt intake", "Dashboard", "Summary reports"]
  }`);

  assert.equal(result.heroHeadline, "Build your startup finance system in one prompt.");
  assert.equal(result.features.length, 3);
  assert.deepEqual(result.techStack, ["Next.js", "TypeScript", "Tailwind CSS"]);
});

test("parseDevelopmentAgentResponse rejects invalid shapes", () => {
  assert.throws(
    () =>
      parseDevelopmentAgentResponse(`{
        "heroHeadline": "",
        "heroSubheading": "",
        "features": { "bad": true },
        "cta": "",
        "pricingSection": "",
        "techStack": [],
        "mvpFeatures": []
      }`),
    /features/
  );
});

test("parseDevelopmentAgentResponse normalizes list-like strings into arrays", () => {
  const result = parseDevelopmentAgentResponse(`{
    "heroHeadline": "Build your startup finance system in one prompt.",
    "heroSubheading": "COMET AGENT turns bookkeeping chaos into founder-ready clarity.",
    "features": "- Automated categorization\\n- Runway insights\\n- Weekly reports",
    "cta": "Start planning your finance stack",
    "pricingSection": "Start with a free trial, then move to a monthly founder plan.",
    "techStack": "Next.js, TypeScript, Tailwind CSS",
    "mvpFeatures": "Prompt intake; Dashboard; Summary reports"
  }`);

  assert.deepEqual(result.features, [
    "Automated categorization",
    "Runway insights",
    "Weekly reports",
  ]);
  assert.deepEqual(result.techStack, ["Next.js", "TypeScript", "Tailwind CSS"]);
  assert.deepEqual(result.mvpFeatures, [
    "Prompt intake",
    "Dashboard",
    "Summary reports",
  ]);
});

test("parseDevelopmentAgentResponse normalizes object-based AI output", () => {
  const result = parseDevelopmentAgentResponse(`{
    "heroHeadline": "Ship your startup system faster.",
    "heroSubheading": "COMET AGENT turns raw ideas into execution plans.",
    "features": [
      { "title": "Research Agent", "description": "Maps the market" },
      { "title": "Strategy Agent", "description": "Defines the wedge" }
    ],
    "cta": "Run the workflow",
    "pricingSection": {
      "title": "Starter",
      "price": "$49"
    },
    "techStack": ["Next.js", "TypeScript"],
    "mvpFeatures": ["Prompt input", "Agent outputs"]
  }`);

  assert.deepEqual(result.features, [
    "Research Agent: Maps the market",
    "Strategy Agent: Defines the wedge",
  ]);
  assert.equal(result.pricingSection, "{\"title\":\"Starter\",\"price\":\"$49\"}");
});
