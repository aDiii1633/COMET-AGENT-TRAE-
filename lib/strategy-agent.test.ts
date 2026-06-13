import assert from "node:assert/strict";
import test from "node:test";

import {
  createStrategyAgentPrompt,
  parseStrategyAgentResponse,
} from "./strategy-agent.ts";

const researchOutput = {
  competitors: ["QuickBooks", "Wave"],
  targetAudience: ["Solo founders", "Freelancers"],
  marketOpportunity: "There is strong demand for simpler finance tooling.",
  industryTrends: ["AI automation", "Embedded finance"],
  challenges: ["Trust", "Accuracy"],
  recommendations: ["Focus on ease of use", "Start with a niche"],
};

test("createStrategyAgentPrompt includes business idea, research, and exact schema", () => {
  const prompt = createStrategyAgentPrompt({
    businessIdea: "AI finance copilot for solo founders",
    researchOutput,
  });

  assert.match(prompt, /Business Idea:/);
  assert.match(prompt, /Research Output:/);
  assert.match(prompt, /AI finance copilot for solo founders/);
  assert.match(prompt, /"competitors"/);
  assert.match(prompt, /"businessName": ""/);
  assert.match(prompt, /"launchPlan": \[\]/);
});

test("parseStrategyAgentResponse accepts valid JSON output", () => {
  const result = parseStrategyAgentResponse(`{
    "businessName": "LedgerPilot",
    "tagline": "Finance clarity for solo builders.",
    "usp": "An AI-native bookkeeping guide built for single-person startups.",
    "revenueModel": ["Subscription", "Add-on services"],
    "pricingStrategy": "Tiered monthly pricing with a founder-friendly entry plan.",
    "growthStrategy": ["Founder communities", "Partner referrals"],
    "launchPlan": ["Waitlist", "Private beta", "Public launch"]
  }`);

  assert.equal(result.businessName, "LedgerPilot");
  assert.equal(result.tagline, "Finance clarity for solo builders.");
  assert.deepEqual(result.launchPlan, ["Waitlist", "Private beta", "Public launch"]);
});

test("parseStrategyAgentResponse rejects invalid shapes", () => {
  assert.throws(
    () =>
      parseStrategyAgentResponse(`{
        "businessName": "",
        "tagline": "",
        "usp": "",
        "revenueModel": "subscription",
        "pricingStrategy": "",
        "growthStrategy": [],
        "launchPlan": []
      }`),
    /revenueModel/
  );
});
