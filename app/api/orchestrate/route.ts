import { NextResponse } from "next/server";

import { runOrchestrator } from "@/lib/orchestrator";
import { runResearchAgent } from "@/lib/agents/research";
import { runStrategyAgent } from "@/lib/agents/strategy";
import { runContentAgent } from "@/lib/agents/content";
import { runDevelopmentAgent } from "@/lib/agents/development";
import { runPitchAgent } from "@/lib/agents/pitch";
import type { ResearchAgentOutput } from "@/lib/research-agent";
import type { StrategyAgentOutput } from "@/lib/strategy-agent";
import type { ContentAgentOutput } from "@/lib/content-agent";
import type { DevelopmentAgentOutput } from "@/lib/development-agent";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      prompt?: unknown;
      agentId?: unknown;
      dependencies?: unknown;
    };
    const prompt =
      typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const agentId = typeof body.agentId === "string" ? body.agentId : null;

    if (agentId) {
      const deps = (body.dependencies || {}) as {
        research?: ResearchAgentOutput;
        strategy?: StrategyAgentOutput;
        content?: ContentAgentOutput;
        development?: DevelopmentAgentOutput;
      };
      let agentResult;

      switch (agentId) {
        case "research":
          agentResult = await runResearchAgent(prompt);
          break;
        case "strategy":
          if (!deps.research) {
            return NextResponse.json(
              { error: "Missing 'research' dependency for strategy agent." },
              { status: 400 }
            );
          }
          agentResult = await runStrategyAgent({
            businessIdea: prompt,
            researchOutput: deps.research,
          });
          break;
        case "content":
          if (!deps.strategy) {
            return NextResponse.json(
              { error: "Missing 'strategy' dependency for content agent." },
              { status: 400 }
            );
          }
          agentResult = await runContentAgent({
            businessIdea: prompt,
            strategyOutput: deps.strategy,
          });
          break;
        case "development":
          if (!deps.strategy) {
            return NextResponse.json(
              { error: "Missing 'strategy' dependency for development agent." },
              { status: 400 }
            );
          }
          agentResult = await runDevelopmentAgent({
            businessIdea: prompt,
            strategyOutput: deps.strategy,
          });
          break;
        case "pitch":
          if (
            !deps.research ||
            !deps.strategy ||
            !deps.content ||
            !deps.development
          ) {
            return NextResponse.json(
              { error: "Missing required dependencies for pitch agent." },
              { status: 400 }
            );
          }
          agentResult = await runPitchAgent({
            researchOutput: deps.research,
            strategyOutput: deps.strategy,
            contentOutput: deps.content,
            developmentOutput: deps.development,
          });
          break;
        default:
          return NextResponse.json(
            { error: `Unknown agentId: ${agentId}` },
            { status: 400 }
          );
      }

      return NextResponse.json({ [agentId]: agentResult });
    }

    const result = await runOrchestrator(prompt);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate the startup plan.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
