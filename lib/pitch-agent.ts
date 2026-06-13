import { generateText } from "./gemini.ts";
import type { ContentAgentOutput } from "./content-agent.ts";
import type { DevelopmentAgentOutput } from "./development-agent.ts";
import type { ResearchAgentOutput } from "./research-agent.ts";
import type { StrategyAgentOutput } from "./strategy-agent.ts";

export type PitchAgentOutput = {
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  competitiveAdvantage: string;
  futureVision: string;
};

type PitchAgentInput = {
  businessIdea: string;
  researchOutput: ResearchAgentOutput;
  strategyOutput: StrategyAgentOutput;
  contentOutput: ContentAgentOutput;
  developmentOutput: DevelopmentAgentOutput;
};

const pitchAgentSystemPrompt = `You are a startup investor.

Create an investor-ready pitch.

Return JSON only.`;

const emptyPitchAgentOutput: PitchAgentOutput = {
  problem: "",
  solution: "",
  market: "",
  businessModel: "",
  competitiveAdvantage: "",
  futureVision: "",
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureString(value: unknown, key: keyof PitchAgentOutput) {
  if (typeof value !== "string") {
    throw new Error(`Invalid Pitch Agent response: "${key}" must be a string.`);
  }

  return value;
}

export function parsePitchAgentResponse(raw: string): PitchAgentOutput {
  const normalized = stripCodeFences(raw);
  const parsed = JSON.parse(normalized) as Partial<PitchAgentOutput>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid Pitch Agent response: expected a JSON object.");
  }

  return {
    problem: ensureString(parsed.problem, "problem"),
    solution: ensureString(parsed.solution, "solution"),
    market: ensureString(parsed.market, "market"),
    businessModel: ensureString(parsed.businessModel, "businessModel"),
    competitiveAdvantage: ensureString(
      parsed.competitiveAdvantage,
      "competitiveAdvantage"
    ),
    futureVision: ensureString(parsed.futureVision, "futureVision"),
  };
}

export function createPitchAgentPrompt({
  businessIdea,
  researchOutput,
  strategyOutput,
  contentOutput,
  developmentOutput,
}: PitchAgentInput) {
  const normalizedIdea = businessIdea.trim();

  if (!normalizedIdea) {
    throw new Error("Business idea is required.");
  }

  return `Business Idea:
${normalizedIdea}

Research Output:
${JSON.stringify(researchOutput, null, 2)}

Strategy Output:
${JSON.stringify(strategyOutput, null, 2)}

Content Output:
${JSON.stringify(contentOutput, null, 2)}

Development Output:
${JSON.stringify(developmentOutput, null, 2)}

Return only valid JSON in this exact format:
{
  "problem": "",
  "solution": "",
  "market": "",
  "businessModel": "",
  "competitiveAdvantage": "",
  "futureVision": ""
}`;
}

export async function runPitchAgent(
  input: PitchAgentInput
): Promise<PitchAgentOutput> {
  const prompt = createPitchAgentPrompt(input);
  const rawResponse = await generateText(prompt, {
    systemInstruction: pitchAgentSystemPrompt,
  });

  return parsePitchAgentResponse(rawResponse);
}

export function createEmptyPitchAgentOutput(): PitchAgentOutput {
  return { ...emptyPitchAgentOutput };
}
