import { generateText } from "./gemini.ts";
import type { StrategyAgentOutput } from "./strategy-agent.ts";

export type ContentAgentOutput = {
  blogIdeas: string[];
  linkedinPosts: string[];
  twitterPosts: string[];
  newsletterTopics: string[];
  youtubeIdeas: string[];
};

type ContentAgentInput = {
  businessIdea: string;
  strategyOutput: StrategyAgentOutput;
};

const contentAgentSystemPrompt = `You are a world-class content marketer.

Generate:

- 10 blog ideas
- 10 LinkedIn posts
- 10 Twitter posts
- 10 newsletter topics
- 10 YouTube video ideas

Return JSON only.`;

const emptyContentAgentOutput: ContentAgentOutput = {
  blogIdeas: [],
  linkedinPosts: [],
  twitterPosts: [],
  newsletterTopics: [],
  youtubeIdeas: [],
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function ensureStringArray(value: unknown, key: keyof ContentAgentOutput) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    throw new Error(`Invalid Content Agent response: "${key}" must be a string array.`);
  }

  return value;
}

function ensureTenItems(value: string[], key: keyof ContentAgentOutput) {
  if (value.length !== 10) {
    throw new Error(`Invalid Content Agent response: "${key}" must contain exactly 10 items.`);
  }

  return value;
}

export function parseContentAgentResponse(raw: string): ContentAgentOutput {
  const normalized = stripCodeFences(raw);
  const parsed = JSON.parse(normalized) as Partial<ContentAgentOutput>;

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Invalid Content Agent response: expected a JSON object.");
  }

  return {
    blogIdeas: ensureTenItems(
      ensureStringArray(parsed.blogIdeas, "blogIdeas"),
      "blogIdeas"
    ),
    linkedinPosts: ensureTenItems(
      ensureStringArray(parsed.linkedinPosts, "linkedinPosts"),
      "linkedinPosts"
    ),
    twitterPosts: ensureTenItems(
      ensureStringArray(parsed.twitterPosts, "twitterPosts"),
      "twitterPosts"
    ),
    newsletterTopics: ensureTenItems(
      ensureStringArray(parsed.newsletterTopics, "newsletterTopics"),
      "newsletterTopics"
    ),
    youtubeIdeas: ensureTenItems(
      ensureStringArray(parsed.youtubeIdeas, "youtubeIdeas"),
      "youtubeIdeas"
    ),
  };
}

export function createContentAgentPrompt({
  businessIdea,
  strategyOutput,
}: ContentAgentInput) {
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
  "blogIdeas": [],
  "linkedinPosts": [],
  "twitterPosts": [],
  "newsletterTopics": [],
  "youtubeIdeas": []
}

Each array must contain exactly 10 strings.`;
}

export async function runContentAgent(
  input: ContentAgentInput
): Promise<ContentAgentOutput> {
  const prompt = createContentAgentPrompt(input);
  const rawResponse = await generateText(prompt, {
    systemInstruction: contentAgentSystemPrompt,
  });

  return parseContentAgentResponse(rawResponse);
}

export function createEmptyContentAgentOutput(): ContentAgentOutput {
  return { ...emptyContentAgentOutput };
}
