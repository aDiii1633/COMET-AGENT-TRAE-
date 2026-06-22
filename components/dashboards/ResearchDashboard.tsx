"use client";

import type { ResearchAgentOutput } from "@/lib/research-agent";

export function ResearchDashboard({ data }: { data: ResearchAgentOutput }) {
  const sections = [
    { title: "Competitors", items: data.competitors },
    { title: "Target Audience", items: data.targetAudience },
    { title: "Industry Trends", items: data.industryTrends },
    { title: "Challenges", items: data.challenges },
    { title: "Recommendations", items: data.recommendations },
  ];

  return (
    <div className="space-y-6">
      <div className="dashboard-card bg-gradient-to-r from-sky-50 to-blue-50 border-sky-100">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-sky-700">
          Market Opportunity
        </h3>
        <p className="text-sm leading-relaxed text-slate-700">
          {data.marketOpportunity}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="dashboard-card">
            <h3 className="mb-4 text-sm font-semibold text-text-primary">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, index) => (
                <li
                  key={`${section.title}-${index}`}
                  className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-text-secondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
