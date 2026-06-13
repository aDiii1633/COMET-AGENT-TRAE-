import assert from "node:assert/strict";
import test from "node:test";

import {
  createResearchAgentPrompt,
  parseResearchAgentResponse,
} from "./research-agent.ts";

test("createResearchAgentPrompt includes the business idea and exact schema", () => {
  const prompt = createResearchAgentPrompt("AI copilot for solo founders");

  assert.match(prompt, /Business Idea:/);
  assert.match(prompt, /AI copilot for solo founders/);
  assert.match(prompt, /"competitors": \[\]/);
  assert.match(prompt, /"marketOpportunity": ""/);
});

test("parseResearchAgentResponse accepts valid JSON output", () => {
  const result = parseResearchAgentResponse(`{
    "competitors": ["Competitor A", "Competitor B"],
    "targetAudience": ["Founders", "Operators"],
    "marketOpportunity": "A large workflow gap exists.",
    "industryTrends": ["AI automation", "Vertical SaaS"],
    "challenges": ["Crowded market", "Trust"],
    "recommendations": ["Focus on wedge", "Validate ICP"]
  }`);

  assert.deepEqual(result.competitors, ["Competitor A", "Competitor B"]);
  assert.equal(result.marketOpportunity, "A large workflow gap exists.");
  assert.deepEqual(result.recommendations, ["Focus on wedge", "Validate ICP"]);
});

test("parseResearchAgentResponse rejects invalid shapes", () => {
  assert.throws(
    () =>
      parseResearchAgentResponse(`{
        "competitors": "not-an-array",
        "targetAudience": [],
        "marketOpportunity": "",
        "industryTrends": [],
        "challenges": [],
        "recommendations": []
      }`),
    /competitors/
  );
});
