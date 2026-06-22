import { Search, Target, PenTool, Code2, Presentation } from "lucide-react";
import { AgentRuntimeStatus } from "@/lib/site-data";
import { motion } from "framer-motion";

export const AGENT_LIST = [
  { id: "research", name: "Research Agent", icon: Search, color: "text-sky-500", bg: "bg-sky-50", bgActive: "bg-sky-100", ring: "ring-sky-200" },
  { id: "strategy", name: "Strategy Agent", icon: Target, color: "text-violet-500", bg: "bg-violet-50", bgActive: "bg-violet-100", ring: "ring-violet-200" },
  { id: "content", name: "Content Agent", icon: PenTool, color: "text-pink-500", bg: "bg-pink-50", bgActive: "bg-pink-100", ring: "ring-pink-200" },
  { id: "development", name: "Development Agent", icon: Code2, color: "text-emerald-500", bg: "bg-emerald-50", bgActive: "bg-emerald-100", ring: "ring-emerald-200" },
  { id: "pitch", name: "Pitch Agent", icon: Presentation, color: "text-amber-500", bg: "bg-amber-50", bgActive: "bg-amber-100", ring: "ring-amber-200" },
];

interface SidebarProps {
  statuses: Record<string, AgentRuntimeStatus>;
  onSelectAgent?: (id: string) => void;
  selectedAgentId?: string;
  isPlaygroundMode?: boolean;
}

const getStatusColor = (status: AgentRuntimeStatus) => {
  switch (status) {
    case "Queued": return "bg-slate-300";
    case "Loading": return "bg-sky-400 animate-pulse";
    case "Completed": return "bg-emerald-400";
    default: return "bg-slate-300";
  }
};

const getStatusLabel = (status: AgentRuntimeStatus) => {
  switch (status) {
    case "Queued": return "Ready";
    case "Loading": return "Running";
    case "Completed": return "Complete";
    default: return "Ready";
  }
};

const getStatusTextColor = (status: AgentRuntimeStatus) => {
  switch (status) {
    case "Queued": return "text-slate-400";
    case "Loading": return "text-sky-500";
    case "Completed": return "text-emerald-500";
    default: return "text-slate-400";
  }
};



export function Sidebar({ statuses, onSelectAgent, selectedAgentId, isPlaygroundMode }: SidebarProps) {
  return (
    <div className="w-64 glass-panel h-screen flex flex-col pt-4 px-3 pb-4 overflow-y-auto border-r border-border">
      {/* Agent Workforce Header */}
      <div className="mb-4 px-2 pt-1">
        <h2 className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-1">
          AI Workforce
        </h2>
        <p className="text-[10px] text-text-muted">
          {isPlaygroundMode ? "Select an agent to interact" : "Orchestrator manages all agents"}
        </p>
      </div>

      {/* Agent List */}
      <div className="space-y-1 px-1">
        {AGENT_LIST.map((agent, index) => {
          const status = statuses[agent.id] || "Queued";
          const Icon = agent.icon;
          const isSelected = selectedAgentId === agent.id;

          return (
            <motion.button
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => onSelectAgent?.(agent.id)}
              disabled={!isPlaygroundMode}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left group ${
                isSelected
                  ? `${agent.bgActive} ring-1 ${agent.ring}`
                  : `hover:bg-slate-50 ${!isPlaygroundMode ? "cursor-default" : "cursor-pointer"}`
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? agent.bg : "bg-slate-50 group-hover:bg-white"} transition-colors`}>
                <Icon className={`w-4 h-4 ${isSelected ? agent.color : "text-slate-400 group-hover:text-slate-600"} transition-colors`} />
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-medium block truncate ${isSelected ? "text-slate-800" : "text-slate-600"}`}>
                  {agent.name}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(status)}`} />
                  <span className={`text-[10px] font-medium ${getStatusTextColor(status)}`}>
                    {getStatusLabel(status)}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Workflow Visualization */}
      <div className="mt-6 mx-2 pt-4 border-t border-border">
        <h3 className="text-[10px] uppercase tracking-widest text-text-muted font-semibold mb-3">
          Workflow Pipeline
        </h3>
        <div className="space-y-1.5">
          {["research", "strategy", "content", "development", "pitch"].map((id, idx) => {
            const agent = AGENT_LIST.find(a => a.id === id)!;
            const status = statuses[id] || "Queued";
            const isParallel = id === "content" || id === "development";

            return (
              <div key={id}>
                {isParallel && id === "content" && (
                  <div className="flex items-center gap-2 ml-3 mb-1">
                    <div className="w-px h-3 bg-slate-200" />
                    <span className="text-[9px] text-text-muted uppercase tracking-wider">parallel</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${
                    status === "Completed" ? "bg-emerald-100 text-emerald-600" :
                    status === "Loading" ? "bg-sky-100 text-sky-600" :
                    "bg-slate-100 text-slate-400"
                  }`}>
                    {status === "Completed" ? "✓" : idx + 1}
                  </div>
                  <span className={`text-xs font-medium ${
                    status === "Completed" ? "text-emerald-600" :
                    status === "Loading" ? "text-sky-600" :
                    "text-slate-400"
                  }`}>
                    {agent.name.replace(" Agent", "")}
                  </span>
                </div>
                {idx < 4 && !isParallel && id !== "development" && (
                  <div className="ml-[9px] w-px h-2 bg-slate-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom branding */}
      <div className="mt-auto pt-4 border-t border-border mx-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center">
            <span className="text-white font-bold text-[10px]">C</span>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-text-primary">COMET AGENT</p>
            <p className="text-[9px] text-text-muted">v2.0 • Premium</p>
          </div>
        </div>
      </div>
    </div>
  );
}
