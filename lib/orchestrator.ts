import { runContentAgent, type ContentAgentOutput } from "./agents/content.ts";
import {
  runDevelopmentAgent,
  type DevelopmentAgentOutput,
} from "./agents/development.ts";
import { runPitchAgent, type PitchAgentOutput } from "./agents/pitch.ts";
import { runResearchAgent, type ResearchAgentOutput } from "./agents/research.ts";
import { runStrategyAgent, type StrategyAgentOutput } from "./agents/strategy.ts";

export type OrchestratorOutput = {
  research: ResearchAgentOutput;
  strategy: StrategyAgentOutput;
  content: ContentAgentOutput;
  development: DevelopmentAgentOutput;
  pitch: PitchAgentOutput;
};

type OrchestratorDependencies = {
  runResearchAgent: typeof runResearchAgent;
  runStrategyAgent: typeof runStrategyAgent;
  runContentAgent: typeof runContentAgent;
  runDevelopmentAgent: typeof runDevelopmentAgent;
  runPitchAgent: typeof runPitchAgent;
};

const defaultDependencies: OrchestratorDependencies = {
  runResearchAgent,
  runStrategyAgent,
  runContentAgent,
  runDevelopmentAgent,
  runPitchAgent,
};

export async function runOrchestrator(
  userGoal: string,
  dependencies: OrchestratorDependencies = defaultDependencies
): Promise<OrchestratorOutput> {
  const normalizedGoal = userGoal.trim();

  if (!normalizedGoal) {
    throw new Error("User goal is required.");
  }

  const research = await dependencies.runResearchAgent(normalizedGoal);
  const strategy = await dependencies.runStrategyAgent({
    businessIdea: normalizedGoal,
    researchOutput: research,
  });
  const content = await dependencies.runContentAgent({
    businessIdea: normalizedGoal,
    strategyOutput: strategy,
  });
  const development = await dependencies.runDevelopmentAgent({
    businessIdea: normalizedGoal,
    strategyOutput: strategy,
  });
  const pitch = await dependencies.runPitchAgent({
    researchOutput: research,
    strategyOutput: strategy,
    contentOutput: content,
    developmentOutput: development,
  });

  return {
    research,
    strategy,
    content,
    development,
    pitch,
  };
}
