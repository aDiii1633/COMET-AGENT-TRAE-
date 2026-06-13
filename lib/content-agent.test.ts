import assert from "node:assert/strict";
import test from "node:test";

import {
  createContentAgentPrompt,
  parseContentAgentResponse,
} from "./content-agent.ts";

const strategyOutput = {
  businessName: "COMET AGENT",
  tagline: "Finance clarity for solo builders.",
  usp: "AI-native bookkeeping built for solo founders.",
  revenueModel: ["Subscription", "Add-on services"],
  pricingStrategy: "Tiered monthly pricing.",
  growthStrategy: ["Founder communities", "Partnerships"],
  launchPlan: ["Waitlist", "Private beta", "Public launch"],
};

test("createContentAgentPrompt includes business idea, strategy output, and schema", () => {
  const prompt = createContentAgentPrompt({
    businessIdea: "AI bookkeeping copilot for solo founders",
    strategyOutput,
  });

  assert.match(prompt, /Business Idea:/);
  assert.match(prompt, /Strategy Output:/);
  assert.match(prompt, /AI bookkeeping copilot for solo founders/);
  assert.match(prompt, /"businessName": "COMET AGENT"/);
  assert.match(prompt, /"youtubeIdeas": \[\]/);
  assert.match(prompt, /exactly 10 strings/);
});

test("parseContentAgentResponse accepts valid JSON output", () => {
  const result = parseContentAgentResponse(`{
    "blogIdeas": ["1","2","3","4","5","6","7","8","9","10"],
    "linkedinPosts": ["1","2","3","4","5","6","7","8","9","10"],
    "twitterPosts": ["1","2","3","4","5","6","7","8","9","10"],
    "newsletterTopics": ["1","2","3","4","5","6","7","8","9","10"],
    "youtubeIdeas": ["1","2","3","4","5","6","7","8","9","10"]
  }`);

  assert.equal(result.blogIdeas.length, 10);
  assert.equal(result.linkedinPosts.length, 10);
  assert.equal(result.youtubeIdeas[9], "10");
});

test("parseContentAgentResponse rejects arrays that do not contain exactly 10 items", () => {
  assert.throws(
    () =>
      parseContentAgentResponse(`{
        "blogIdeas": ["1","2"],
        "linkedinPosts": ["1","2","3","4","5","6","7","8","9","10"],
        "twitterPosts": ["1","2","3","4","5","6","7","8","9","10"],
        "newsletterTopics": ["1","2","3","4","5","6","7","8","9","10"],
        "youtubeIdeas": ["1","2","3","4","5","6","7","8","9","10"]
      }`),
    /blogIdeas/
  );
});
