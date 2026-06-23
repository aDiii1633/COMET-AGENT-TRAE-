"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { ModeSwitcher, AppMode } from "./mode-switcher";
import { BusinessOrchestrator } from "./business-orchestrator";
import { AgentPlayground } from "./agent-playground";
import { AgentRuntimeStatus, workflowSteps } from "@/lib/site-data";
import { OrchestratorOutput } from "@/lib/orchestrator";
import { Sparkles } from "lucide-react";

const runtimeDelay = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const createQueuedStatuses = (): Record<string, AgentRuntimeStatus> =>
  Object.fromEntries(workflowSteps.map((step) => [step.id, "Queued"]));

interface AppShellProps {
  onBackToHome?: () => void;
}

export function AppShell({ onBackToHome }: AppShellProps) {
  const [currentMode, setCurrentMode] = useState<AppMode>("orchestrator");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("research");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [statuses, setStatuses] = useState<Record<string, AgentRuntimeStatus>>(
    createQueuedStatuses()
  );

  const runAgentApi = async (
    agentId: string,
    currentResults: Partial<OrchestratorOutput>,
    prompt: string
  ) => {
    const dependencies: {
      research?: OrchestratorOutput["research"];
      strategy?: OrchestratorOutput["strategy"];
      content?: OrchestratorOutput["content"];
      development?: OrchestratorOutput["development"];
    } = {};
    if (agentId === "strategy") {
      dependencies.research = currentResults.research;
    } else if (agentId === "content" || agentId === "development") {
      dependencies.strategy = currentResults.strategy;
    } else if (agentId === "pitch") {
      dependencies.research = currentResults.research;
      dependencies.strategy = currentResults.strategy;
      dependencies.content = currentResults.content;
      dependencies.development = currentResults.development;
    }

    const res = await fetch("/api/orchestrate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, agentId, dependencies }),
    });

    const body = (await res.json()) as Record<string, unknown>;

    if (!res.ok || typeof body !== "object" || body === null || !(agentId in body)) {
      const errorMsg =
        body && typeof body === "object" && "error" in body && typeof body.error === "string"
          ? body.error
          : `Failed to generate output for ${agentId} Agent.`;
      throw new Error(errorMsg);
    }

    return body[agentId];
  };

  const handleGenerateWorkflow = async (prompt: string, selectedAgents: string[]) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setError(null);

    const currentResults: Partial<OrchestratorOutput> = results ? { ...results } : {};

    // Resolve dependencies in order:
    // research -> strategy -> (content, development) -> pitch
    const runList: string[] = [];
    if (
      selectedAgents.includes("research") ||
      ((selectedAgents.includes("strategy") || selectedAgents.includes("pitch")) &&
        !currentResults.research)
    ) {
      if (!runList.includes("research")) runList.push("research");
    }
    if (
      selectedAgents.includes("strategy") ||
      ((selectedAgents.includes("content") ||
        selectedAgents.includes("development") ||
        selectedAgents.includes("pitch")) &&
        !currentResults.strategy)
    ) {
      if (!runList.includes("strategy")) runList.push("strategy");
    }
    if (
      selectedAgents.includes("content") ||
      (selectedAgents.includes("pitch") && !currentResults.content)
    ) {
      if (!runList.includes("content")) runList.push("content");
    }
    if (
      selectedAgents.includes("development") ||
      (selectedAgents.includes("pitch") && !currentResults.development)
    ) {
      if (!runList.includes("development")) runList.push("development");
    }
    if (selectedAgents.includes("pitch")) {
      if (!runList.includes("pitch")) runList.push("pitch");
    }

    // Set statuses for all running agents to Queued first
    const nextStatuses = { ...statuses };
    runList.forEach((id) => {
      nextStatuses[id] = "Queued";
    });
    setStatuses(nextStatuses);

    try {
      // 1. Run Research
      if (runList.includes("research")) {
        setStatuses((current) => ({ ...current, research: "Loading" }));
        const researchOut = await runAgentApi("research", currentResults, prompt);
        currentResults.research = researchOut as OrchestratorOutput["research"];
        setResults({ ...currentResults } as OrchestratorOutput);
        setStatuses((current) => ({ ...current, research: "Completed" }));
        await runtimeDelay(100);
      }

      // 2. Run Strategy
      if (runList.includes("strategy")) {
        setStatuses((current) => ({ ...current, strategy: "Loading" }));
        const strategyOut = await runAgentApi("strategy", currentResults, prompt);
        currentResults.strategy = strategyOut as OrchestratorOutput["strategy"];
        setResults({ ...currentResults } as OrchestratorOutput);
        setStatuses((current) => ({ ...current, strategy: "Completed" }));
        await runtimeDelay(100);
      }

      // 3. Run Content and Development in Parallel
      const contentPromise = runList.includes("content")
        ? (async () => {
            setStatuses((current) => ({ ...current, content: "Loading" }));
            const contentOut = await runAgentApi("content", currentResults, prompt);
            currentResults.content = contentOut as OrchestratorOutput["content"];
            setResults({ ...currentResults } as OrchestratorOutput);
            setStatuses((current) => ({ ...current, content: "Completed" }));
          })()
        : Promise.resolve();

      const developmentPromise = runList.includes("development")
        ? (async () => {
            setStatuses((current) => ({ ...current, development: "Loading" }));
            const developmentOut = await runAgentApi("development", currentResults, prompt);
            currentResults.development = developmentOut as OrchestratorOutput["development"];
            setResults({ ...currentResults } as OrchestratorOutput);
            setStatuses((current) => ({ ...current, development: "Completed" }));
          })()
        : Promise.resolve();

      await Promise.all([contentPromise, developmentPromise]);
      await runtimeDelay(100);

      // 4. Run Pitch
      if (runList.includes("pitch")) {
        setStatuses((current) => ({ ...current, pitch: "Loading" }));
        const pitchOut = await runAgentApi("pitch", currentResults, prompt);
        currentResults.pitch = pitchOut as OrchestratorOutput["pitch"];
        setResults({ ...currentResults } as OrchestratorOutput);
        setStatuses((current) => ({ ...current, pitch: "Completed" }));
      }
    } catch (err: unknown) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate outputs.";
      setError(errorMessage);
      // Reset any loading or queued agent statuses back to Queued if they didn't complete
      setStatuses((current) => {
        const next = { ...current };
        runList.forEach((id) => {
          if (next[id] !== "Completed") {
            next[id] = "Queued";
          }
        });
        return next;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-slate-900 overflow-hidden font-sans">
      {/* Sidebar - fixed on the left */}
      <Sidebar 
        statuses={statuses}
        isPlaygroundMode={currentMode === "playground"}
        selectedAgentId={currentMode === "playground" ? selectedAgentId : undefined}
        onSelectAgent={setSelectedAgentId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button 
                onClick={onBackToHome}
                className="mr-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                ← Back
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-sky-200">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-[13px] tracking-wide uppercase">Comet Agent</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">AI Workforce Platform</p>
            </div>
          </div>

          <ModeSwitcher currentMode={currentMode} onModeChange={setCurrentMode} />
        </header>

        {/* Dynamic Content View */}
        {currentMode === "orchestrator" ? (
          <BusinessOrchestrator 
            statuses={statuses}
            isGenerating={isGenerating}
            onGenerateWorkflow={handleGenerateWorkflow}
            results={results}
            error={error}
            onClearError={() => setError(null)}
          />
        ) : (
          <AgentPlayground 
            selectedAgentId={selectedAgentId}
            onSelectAgent={setSelectedAgentId}
          />
        )}
      </div>
    </div>
  );
}

