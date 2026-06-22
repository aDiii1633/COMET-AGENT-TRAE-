"use client";

import { useState } from "react";
import { Sidebar, AGENT_LIST } from "./sidebar";
import { ModeSwitcher, AppMode } from "./mode-switcher";
import { BusinessOrchestrator } from "./business-orchestrator";
import { AgentPlayground } from "./agent-playground";
import { AgentRuntimeStatus, defaultPrompt, workflowSteps } from "@/lib/site-data";
import { OrchestratorOutput } from "@/lib/orchestrator";
import { Sparkles } from "lucide-react";

const runtimeDelay = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const createQueuedStatuses = (): Record<string, AgentRuntimeStatus> =>
  Object.fromEntries(workflowSteps.map((step) => [step.id, "Queued"]));

const createCompletedStatuses = (): Record<string, AgentRuntimeStatus> =>
  Object.fromEntries(workflowSteps.map((step) => [step.id, "Completed"]));

export function AppShell() {
  const [currentMode, setCurrentMode] = useState<AppMode>("orchestrator");
  const [selectedAgentId, setSelectedAgentId] = useState<string>("research");

  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<OrchestratorOutput | null>(null);
  const [statuses, setStatuses] = useState<Record<string, AgentRuntimeStatus>>(
    createQueuedStatuses()
  );

  const animateWorkflow = async () => {
    for (const step of workflowSteps) {
      setStatuses((current) => ({
        ...current,
        [step.id]: "Loading",
      }));
      await runtimeDelay(950);

      setStatuses((current) => ({
        ...current,
        [step.id]: "Completed",
      }));
      await runtimeDelay(350);
    }
  };

  const handleGenerateWorkflow = async (prompt: string, selectedAgents: string[]) => {
    if (isGenerating) return;

    setIsGenerating(true);
    // Only queue statuses for agents that were actually selected
    const nextStatuses: Record<string, AgentRuntimeStatus> = {};
    workflowSteps.forEach(step => {
      if (selectedAgents.includes(step.id)) {
        nextStatuses[step.id] = "Queued";
      } else {
        nextStatuses[step.id] = statuses[step.id] || "Queued"; // keep existing status or queued
      }
    });
    setStatuses(nextStatuses);

    try {
      const requestPromise = fetch("/api/orchestrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      }).then(async (response) => {
        const body = (await response.json()) as unknown;

        if (
          !response.ok ||
          typeof body !== "object" ||
          body === null ||
          !("research" in body)
        ) {
          throw new Error("Failed to generate the startup plan.");
        }

        return body as OrchestratorOutput;
      });

      // Animate only selected agents
      const animateSelected = async () => {
        for (const step of workflowSteps) {
          if (selectedAgents.includes(step.id)) {
            setStatuses((current) => ({
              ...current,
              [step.id]: "Loading",
            }));
            await runtimeDelay(950);
            setStatuses((current) => ({
              ...current,
              [step.id]: "Completed",
            }));
            await runtimeDelay(350);
          }
        }
      };

      const [orchestratedResults] = await Promise.all([
        requestPromise,
        animateSelected(),
      ]);

      setResults((prev) => ({
        ...prev,
        ...orchestratedResults
      } as OrchestratorOutput));
    } catch (error) {
      console.error(error);
      // Reset statuses for selected agents on error
      const resetStatuses = { ...statuses };
      selectedAgents.forEach(id => resetStatuses[id] = "Queued");
      setStatuses(resetStatuses);
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
