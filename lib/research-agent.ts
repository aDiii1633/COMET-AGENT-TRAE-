import { generateText } from "./gemini.ts";

export type ResearchAgentOutput = {
  competitors: string[];
  targetAudience: string[];
  marketOpportunity: string;
  industryTrends: string[];
  challenges: string[];
  recommendations: string[];
};

const researchAgentSystemPrompt = `You are an elite startup research analyst.

Analyze the business idea and provide:

1. Top competitors
2. Target audience
3. Market opportunity
4. Industry trends
5. Risks
6. Recommendations

Return only valid JSON.`;

const emptyResearchAgentOutput: ResearchAgentOutput = {
  competitors: [],
  targetAudience: [],
  marketOpportunity: "",
  industryTrends: [],
  challenges: [],
  recommendations: [],
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureStringArray(value: unknown, key: keyof ResearchAgentOutput) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid Research Agent response: "${key}" must be a string array.`);
  }

  return value;
}

export function parseResearchAgentResponse(raw: string): ResearchAgentOutput {
  const normalized = stripCodeFences(raw);
  const parsed = JSON.parse(normalized) as Partial<ResearchAgentOutput>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid Research Agent response: expected a JSON object.");
  }

  if (typeof parsed.marketOpportunity !== "string") {
    throw new Error(
      'Invalid Research Agent response: "marketOpportunity" must be a string.'
    );
  }

  return {
    competitors: ensureStringArray(parsed.competitors, "competitors"),
    targetAudience: ensureStringArray(parsed.targetAudience, "targetAudience"),
    marketOpportunity: parsed.marketOpportunity,
    industryTrends: ensureStringArray(parsed.industryTrends, "industryTrends"),
    challenges: ensureStringArray(parsed.challenges, "challenges"),
    recommendations: ensureStringArray(parsed.recommendations, "recommendations"),
  };
}

export function createResearchAgentPrompt(businessIdea: string) {
  const normalizedIdea = businessIdea.trim();

  if (!normalizedIdea) {
    throw new Error("Business idea is required.");
  }

  return `Business Idea:
${normalizedIdea}

Return only valid JSON in this exact format:
{
  "competitors": [],
  "targetAudience": [],
  "marketOpportunity": "",
  "industryTrends": [],
  "challenges": [],
  "recommendations": []
}`;
}

export async function runResearchAgent(
  businessIdea: string
): Promise<ResearchAgentOutput> {
  const prompt = createResearchAgentPrompt(businessIdea);
  const rawResponse = await generateText(prompt, {
    systemInstruction: researchAgentSystemPrompt,
  });

  return parseResearchAgentResponse(rawResponse);
}

export function createEmptyResearchAgentOutput(): ResearchAgentOutput {
  return { ...emptyResearchAgentOutput };
}
