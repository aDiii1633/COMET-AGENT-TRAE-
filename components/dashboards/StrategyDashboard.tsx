"use client";

import type { StrategyAgentOutput } from "@/lib/strategy-agent";

export function StrategyDashboard({ data }: { data: StrategyAgentOutput }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-blue-500 to-violet-500 p-7 text-white shadow-lg">
        <h1 className="mb-1 text-3xl font-bold">{data.businessName}</h1>
        <p className="mb-5 text-lg font-medium text-sky-100">{data.tagline}</p>
        <div className="rounded-xl border border-white/20 bg-white/15 p-4">
          <div className="mb-1.5 text-[10px] font-bold tracking-wider text-sky-200 uppercase">
            Unique Selling Proposition
          </div>
          <p className="text-sm font-medium text-white">{data.usp}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="dashboard-card">
          <div className="mb-3 text-sm font-semibold text-sky-500">Revenue Model</div>
          <ul className="space-y-1.5">
            {data.revenueModel.map((item, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="dashboard-card">
          <div className="mb-3 text-sm font-semibold text-violet-500">Growth Strategy</div>
          <ul className="space-y-1.5">
            {data.growthStrategy.map((item, i) => (
              <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0"/> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="dashboard-card">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Pricing Strategy</h3>
            <p className="text-xs leading-relaxed text-text-secondary">{data.pricingStrategy}</p>
          </div>
        </div>

        <div className="dashboard-card lg:col-span-2">
          <h3 className="mb-6 text-sm font-semibold text-text-primary">Launch Roadmap</h3>
          <div className="space-y-5">
            {data.launchPlan.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-white text-sm font-bold shadow-md shadow-sky-200/40 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-sky-500 font-bold text-[10px] uppercase tracking-wider mb-1 block">
                    Step {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed text-text-secondary">{item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
