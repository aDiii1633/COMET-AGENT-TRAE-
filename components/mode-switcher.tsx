"use client";

import { motion } from "framer-motion";

export type AppMode = "playground" | "orchestrator";

interface ModeSwitcherProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export function ModeSwitcher({ currentMode, onModeChange }: ModeSwitcherProps) {
  const modes: { id: AppMode; label: string; desc: string }[] = [
    { id: "playground", label: "Agent Playground", desc: "Chat with individual agents" },
    { id: "orchestrator", label: "Business Orchestrator", desc: "Run full AI workflow" },
  ];

  return (
    <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentMode === mode.id
              ? "text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          {currentMode === mode.id && (
            <motion.div
              layoutId="mode-pill"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{mode.label}</span>
        </button>
      ))}
    </div>
  );
}
