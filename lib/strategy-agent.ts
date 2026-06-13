import { generateText } from "./gemini.ts";
import type { ResearchAgentOutput } from "./research-agent.ts";

export type StrategyAgentOutput = {
  businessName: string;
  tagline: string;
  usp: string;
  revenueModel: string[];
  pricingStrategy: string;
  growthStrategy: string[];
  launchPlan: string[];
};

type StrategyAgentInput = {
  businessIdea: string;
  researchOutput: ResearchAgentOutput;
};

const strategyAgentSystemPrompt = `You are a startup strategist.

Generate:

- Business name
- Tagline
- Unique selling proposition
- Revenue model
- Pricing strategy
- Growth plan
- Launch roadmap

Return valid JSON only.`;

const emptyStrategyAgentOutput: StrategyAgentOutput = {
  businessName: "",
  tagline: "",
  usp: "",
  revenueModel: [],
  pricingStrategy: "",
  growthStrategy: [],
  launchPlan: [],
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureString(value: unknown, key: keyof StrategyAgentOutput) {
  if (typeof value !== "string") {
    throw new Error(`Invalid Strategy Agent response: "${key}" must be a string.`);
  }

  return value;
}

function ensureStringArray(value: unknown, key: keyof StrategyAgentOutput) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid Strategy Agent response: "${key}" must be a string array.`);
  }

  return value;
}

export function parseStrategyAgentResponse(raw: string): StrategyAgentOutput {
  const normalized = stripCodeFences(raw);
  const parsed = JSON.parse(normalized) as Partial<StrategyAgentOutput>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid Strategy Agent response: expected a JSON object.");
  }

  return {
    businessName: ensureString(parsed.businessName, "businessName"),
    tagline: ensureString(parsed.tagline, "tagline"),
    usp: ensureString(parsed.usp, "usp"),
    revenueModel: ensureStringArray(parsed.revenueModel, "revenueModel"),
    pricingStrategy: ensureString(parsed.pricingStrategy, "pricingStrategy"),
    growthStrategy: ensureStringArray(parsed.growthStrategy, "growthStrategy"),
    launchPlan: ensureStringArray(parsed.launchPlan, "launchPlan"),
  };
}

export function createStrategyAgentPrompt({
  businessIdea,
  researchOutput,
}: StrategyAgentInput) {
  const normalizedIdea = businessIdea.trim();

  if (!normalizedIdea) {
    throw new Error("Business idea is required.");
  }

  return `Business Idea:
${normalizedIdea}

Research Output:
${JSON.stringify(researchOutput, null, 2)}

Return only valid JSON in this exact format:
{
  "businessName": "",
  "tagline": "",
  "usp": "",
  "revenueModel": [],
  "pricingStrategy": "",
  "growthStrategy": [],
  "launchPlan": []
}`;
}

export async function runStrategyAgent(
  input: StrategyAgentInput
): Promise<StrategyAgentOutput> {
  const prompt = createStrategyAgentPrompt(input);
  const rawResponse = await generateText(prompt, {
    systemInstruction: strategyAgentSystemPrompt,
  });

  return parseStrategyAgentResponse(rawResponse);
}

export function createEmptyStrategyAgentOutput(): StrategyAgentOutput {
  return { ...emptyStrategyAgentOutput };
}
