import { generateText } from "./gemini.ts";
import type { StrategyAgentOutput } from "./strategy-agent.ts";

export type DevelopmentAgentOutput = {
  heroHeadline: string;
  heroSubheading: string;
  features: string[];
  cta: string;
  pricingSection: string;
  techStack: string[];
  mvpFeatures: string[];
};

type DevelopmentAgentInput = {
  businessIdea: string;
  strategyOutput: StrategyAgentOutput;
};

const developmentAgentSystemPrompt = `You are a SaaS product architect.

Generate:

- Landing page copy
- Product features
- CTA
- Pricing suggestion
- Recommended tech stack
- MVP roadmap

Return JSON only.`;

const emptyDevelopmentAgentOutput: DevelopmentAgentOutput = {
  heroHeadline: "",
  heroSubheading: "",
  features: [],
  cta: "",
  pricingSection: "",
  techStack: [],
  mvpFeatures: [],
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureString(value: unknown, key: keyof DevelopmentAgentOutput) {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object") {
    const normalized = JSON.stringify(value);

    if (normalized !== "{}") {
      return normalized;
    }
  }

  throw new Error(`Invalid Development Agent response: "${key}" must be a string.`);
}

function normalizeObjectItem(item: Record<string, unknown>) {
  const parts = Object.values(item)
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);

  if (parts.length > 0) {
    return parts.join(": ");
  }
}

function ensureStringArray(value: unknown, key: keyof DevelopmentAgentOutput) {
  if (Array.isArray(value)) {
    const normalized = value
      .map((item) => {
        if (typeof item === "string") {
          return item.trim();
        }

        if (item && typeof item === "object") {
          return normalizeObjectItem(item as Record<string, unknown>);
        }
      })
      .filter((item): item is string => Boolean(item));

    if (normalized.length > 0) {
      return normalized;
    }
  }

  if (typeof value !== "string") {
    throw new Error(`Invalid Development Agent response: "${key}" must be a string array.`);
  }

  const normalized = value
    .split(/\r?\n|;|,/)
    .map((item) => item.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (normalized.length > 0) {
    return normalized;
  }

  throw new Error(`Invalid Development Agent response: "${key}" must be a string array.`);
}

export function parseDevelopmentAgentResponse(raw: string): DevelopmentAgentOutput {
  const normalized = stripCodeFences(raw);
  const parsed = JSON.parse(normalized) as Partial<DevelopmentAgentOutput>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid Development Agent response: expected a JSON object.");
  }

  return {
    heroHeadline: ensureString(parsed.heroHeadline, "heroHeadline"),
    heroSubheading: ensureString(parsed.heroSubheading, "heroSubheading"),
    features: ensureStringArray(parsed.features, "features"),
    cta: ensureString(parsed.cta, "cta"),
    pricingSection: ensureString(parsed.pricingSection, "pricingSection"),
    techStack: ensureStringArray(parsed.techStack, "techStack"),
    mvpFeatures: ensureStringArray(parsed.mvpFeatures, "mvpFeatures"),
  };
}

export function createDevelopmentAgentPrompt({
  businessIdea,
  strategyOutput,
}: DevelopmentAgentInput) {
  const normalizedIdea = businessIdea.trim();

  if (!normalizedIdea) {
    throw new Error("Business idea is required.");
  }

  return `Business Idea:
${normalizedIdea}

Strategy Output:
${JSON.stringify(strategyOutput, null, 2)}

Return only valid JSON in this exact format:
{
  "heroHeadline": "",
  "heroSubheading": "",
  "features": [],
  "cta": "",
  "pricingSection": "",
  "techStack": [],
  "mvpFeatures": []
}`;
}

export async function runDevelopmentAgent(
  input: DevelopmentAgentInput
): Promise<DevelopmentAgentOutput> {
  const prompt = createDevelopmentAgentPrompt(input);
  const rawResponse = await generateText(prompt, {
    systemInstruction: developmentAgentSystemPrompt,
  });

  return parseDevelopmentAgentResponse(rawResponse);
}

export function createEmptyDevelopmentAgentOutput(): DevelopmentAgentOutput {
  return { ...emptyDevelopmentAgentOutput };
}
