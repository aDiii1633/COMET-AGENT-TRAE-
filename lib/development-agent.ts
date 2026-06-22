import { generateText } from "./gemini.ts";
import type { StrategyAgentOutput } from "./strategy-agent.ts";

export type DevelopmentFeature = {
  name: string;
  description: string;
};

export type DevKanbanItem = {
  task: string;
  priority: "High" | "Medium" | "Low";
};

export type DevelopmentAgentOutput = {
  productArchitecture: string;
  techStack: { name: string; category: string; url?: string }[];
  kanbanRoadmap: {
    now: DevKanbanItem[];
    next: DevKanbanItem[];
    later: DevKanbanItem[];
  };
  mvpFeatures: DevelopmentFeature[];
  developmentTimeline: { phase: string; duration: string; goal: string }[];
  htmlLandingPage?: string;
};

type DevelopmentAgentInput = {
  businessIdea: string;
  strategyOutput: StrategyAgentOutput;
};

const developmentAgentSystemPrompt = `You are an elite SaaS product architect and frontend developer.

Generate:

- Product architecture overview
- Tech Stack (recommend free tools: highlight 'Lovable' for UI, 'Vercel' for deploy, 'Supabase' for DB with links)
- Kanban Roadmap (Now, Next, Later priority lists)
- MVP Features
- Development Timeline
- An HTML Landing Page (A simple, clean, single-file HTML landing page structure. DO NOT use React/Next.js. Use raw HTML, CSS within a <style> tag, and basic JS if needed. Make it look modern and premium, but keep it as a single string of HTML code. Keep the HTML code concise and under 150 lines total to avoid JSON truncation).

Return JSON only.`;

const emptyDevelopmentAgentOutput: DevelopmentAgentOutput = {
  productArchitecture: "",
  techStack: [],
  kanbanRoadmap: { now: [], next: [], later: [] },
  mvpFeatures: [],
  developmentTimeline: [],
  htmlLandingPage: "",
};

function stripCodeFences(value: string) {
  return value
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export function parseDevelopmentAgentResponse(raw: string): DevelopmentAgentOutput {
  try {
    const normalized = stripCodeFences(raw);
    const parsed = JSON.parse(normalized);

    return {
      productArchitecture: parsed.productArchitecture || "",
      techStack: Array.isArray(parsed.techStack) ? parsed.techStack : [],
      kanbanRoadmap: parsed.kanbanRoadmap || emptyDevelopmentAgentOutput.kanbanRoadmap,
      mvpFeatures: Array.isArray(parsed.mvpFeatures) ? parsed.mvpFeatures : [],
      developmentTimeline: Array.isArray(parsed.developmentTimeline) ? parsed.developmentTimeline : [],
      htmlLandingPage: parsed.htmlLandingPage || "",
    };
  } catch (error) {
    console.error("Failed to parse development output:", error);
    return emptyDevelopmentAgentOutput;
  }
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
  "productArchitecture": "Brief architecture description",
  "techStack": [
    { "name": "Lovable", "category": "UI Builder", "url": "https://lovable.dev" },
    { "name": "Supabase", "category": "Database", "url": "https://supabase.com" }
  ],
  "kanbanRoadmap": {
    "now": [ { "task": "Setup DB", "priority": "High" } ],
    "next": [ { "task": "User Auth", "priority": "Medium" } ],
    "later": [ { "task": "Analytics", "priority": "Low" } ]
  },
  "mvpFeatures": [
    { "name": "Feature 1", "description": "Desc..." }
  ],
  "developmentTimeline": [
    { "phase": "Week 1", "duration": "7 days", "goal": "Setup core infra" }
  ],
  "htmlLandingPage": "<!DOCTYPE html><html><head><style>body { font-family: sans-serif; }</style></head><body><h1>Landing Page</h1></body></html>"
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
