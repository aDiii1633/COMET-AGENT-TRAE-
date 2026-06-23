/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Sparkles, X, Zap, ArrowRight } from "lucide-react";
import { AgentRuntimeStatus } from "@/lib/site-data";
import { AgentOutputCards } from "./agent-output-cards";
import { AGENT_LIST } from "./sidebar";
import { OrchestratorOutput } from "@/lib/orchestrator";
import { AnimatePresence, motion } from "framer-motion";
import { ResearchDashboard } from "./dashboards/ResearchDashboard";
import { StrategyDashboard } from "./dashboards/StrategyDashboard";
import { ContentDashboard } from "./dashboards/ContentDashboard";
import { DevelopmentDashboard } from "./dashboards/DevelopmentDashboard";
import { PitchDashboard } from "./dashboards/PitchDashboard";

interface BusinessOrchestratorProps {
  statuses: Record<string, AgentRuntimeStatus>;
  onGenerateWorkflow: (prompt: string, selectedAgents: string[]) => void;
  isGenerating: boolean;
  results: OrchestratorOutput | null;
  error?: string | null;
  onClearError?: () => void;
}

export function BusinessOrchestrator({
  statuses,
  onGenerateWorkflow,
  isGenerating,
  results,
  error = null,
  onClearError,
}: BusinessOrchestratorProps) {
  const [prompt, setPrompt] = useState("");

  const [selectedAgents, setSelectedAgents] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    AGENT_LIST.forEach((a) => (initial[a.id] = true));
    return initial;
  });

  const [viewingOutputId, setViewingOutputId] = useState<string | null>(null);

  const hasOutput: Record<string, boolean> = {};
  if (results) {
    AGENT_LIST.forEach(a => {
      if (results[a.id as keyof OrchestratorOutput]) {
        hasOutput[a.id] = true;
      }
    });
  }

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerateFull = () => {
    if (!prompt.trim() || isGenerating) return;

    const agentsToRun = Object.entries(selectedAgents)
      .filter((entry) => entry[1])
      .map((entry) => entry[0]);

    onGenerateWorkflow(prompt, agentsToRun);
  };

  const handleGenerateSingle = (id: string) => {
    onGenerateWorkflow(prompt || "Refine this part", [id]);
  };

  const handleViewOutput = (id: string) => {
    setViewingOutputId(id);
  };

  const renderDashboard = (id: string) => {
    if (!results) return <div className="text-center p-12 text-text-muted">No output generated yet.</div>;

    try {
      const res: any = results;
      switch (id) {
        case "research": return <ResearchDashboard data={res.research} />;
        case "strategy": return <StrategyDashboard data={res.strategy} />;
        case "content": return <ContentDashboard data={res.content} />;
        case "development": return <DevelopmentDashboard data={res.development} />;
        case "pitch": return <PitchDashboard data={res.pitch} />;
        default: return <div className="text-center p-12 text-text-muted">Unknown agent output</div>;
      }
    } catch (e) {
      console.error(e);
      return <div className="text-center p-12 text-red-500">Failed to render dashboard.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Header & Goal Input */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-500 shadow-md shadow-sky-200/40">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-text-primary">Business Orchestrator</h1>
              </div>
              <p className="text-text-secondary text-sm">Define your business goal and let the AI workforce build the foundation.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                  <span>{error}</span>
                </div>
                {onClearError && (
                  <button
                    onClick={onClearError}
                    className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100/50 transition-colors shrink-0 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            )}

            <div className="glass-card p-6 rounded-2xl">
              <label className="block text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
                What is your business goal?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Launch a fitness newsletter for remote workers..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 resize-none text-sm transition-all"
                rows={3}
              />

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-text-muted font-medium">Agents:</span>
                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => {
                        const allOn: Record<string, boolean> = {};
                        AGENT_LIST.forEach(a => allOn[a.id] = true);
                        setSelectedAgents(allOn);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-600 font-medium transition-colors"
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        const allOff: Record<string, boolean> = {};
                        AGENT_LIST.forEach(a => allOff[a.id] = false);
                        setSelectedAgents(allOff);
                      }}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 font-medium transition-colors"
                    >
                      None
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerateFull}
                  disabled={!prompt.trim() || isGenerating}
                  className="btn-primary flex items-center space-x-2 text-sm"
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Orchestrating...
                    </span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Outputs</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Agent Output Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-text-primary">Agent Output Panel</h2>
              <div className="text-xs text-text-muted font-medium bg-slate-100 px-3 py-1.5 rounded-lg">
                {Object.values(selectedAgents).filter(Boolean).length} of {AGENT_LIST.length} selected
              </div>
            </div>

            <AgentOutputCards
              statuses={statuses}
              selectedAgents={selectedAgents}
              onToggleAgent={toggleAgent}
              onGenerateSingle={handleGenerateSingle}
              onViewOutput={handleViewOutput}
              hasOutput={hasOutput}
              results={results}
            />
          </motion.div>
        </div>
      </div>

      {/* Output Modal */}
      <AnimatePresence>
        {viewingOutputId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setViewingOutputId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/80">
                <div className="flex items-center gap-3">
                  {(() => {
                    const agent = AGENT_LIST.find(a => a.id === viewingOutputId);
                    if (!agent) return null;
                    const AgentIcon = agent.icon;
                    return (
                      <>
                        <div className={`p-2 rounded-lg ${agent.bg}`}>
                          <AgentIcon className={`w-4 h-4 ${agent.color}`} />
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">{agent.name} Output</h3>
                      </>
                    );
                  })()}
                </div>
                <button
                  onClick={() => setViewingOutputId(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-text-muted hover:text-text-primary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {renderDashboard(viewingOutputId)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  );
}
