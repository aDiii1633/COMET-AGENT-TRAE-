"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Box, Cpu, Server, CheckCircle, ExternalLink, Code, Download } from "lucide-react";
import type { DevelopmentAgentOutput } from "@/lib/development-agent";

export function DevelopmentDashboard({ data }: { data: DevelopmentAgentOutput }) {
  const [htmlState, setHtmlState] = useState<"idle" | "skipped" | "generated">(() => {
    if (data.htmlLandingPage && data.htmlLandingPage.length > 50) return "generated";
    return "idle";
  });

  const handleDownloadHtml = () => {
    if (!data.htmlLandingPage) return;
    const blob = new Blob([data.htmlLandingPage], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `landing-page.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">

      {/* Interactive HTML Generator */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-100 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2 mb-2">
              <Code className="text-sky-500" /> HTML Landing Page Generator
            </h3>
            {htmlState === "idle" && (
              <>
                <p className="text-sm text-slate-600 mb-5">Would you like a basic HTML landing page generated?</p>
                <div className="flex gap-3">
                  <button onClick={() => setHtmlState("generated")} className="btn-primary text-sm px-5 py-2">
                    Generate HTML
                  </button>
                  <button onClick={() => setHtmlState("skipped")} className="bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                    Skip
                  </button>
                </div>
              </>
            )}
            {htmlState === "skipped" && (
              <p className="text-sm text-slate-500">HTML generation skipped. Focus on MVP features below.</p>
            )}
            {htmlState === "generated" && (
              <>
                <p className="text-sm text-slate-600 mb-5">Your HTML landing page has been generated and is ready to download.</p>
                <button onClick={handleDownloadHtml} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all">
                  <Download size={16} /> Download HTML
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Build Options */}
      <div>
        <h3 className="font-semibold text-sm text-text-primary mb-4 flex items-center gap-2">
          <Layers size={18} className="text-sky-500"/> Alternative Build Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Cpu size={80}/></div>
            <h4 className="font-bold text-slate-800 mb-2">Lovable Workflow</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Export these requirements directly into Lovable.dev to automatically generate a functional React frontend within minutes. Best for rapid UI prototyping.</p>
            <a href="https://lovable.dev" target="_blank" rel="noreferrer" className="text-sky-500 text-xs font-bold flex items-center gap-1 hover:underline">
              Open Lovable <ExternalLink size={10} />
            </a>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Server size={80}/></div>
            <h4 className="font-bold text-slate-800 mb-2">Supabase Workflow</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">Use Supabase for instant Postgres database, authentication, and edge functions. Seamlessly integrates with the Lovable frontend for a complete full-stack app.</p>
            <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-emerald-500 text-xs font-bold flex items-center gap-1 hover:underline">
              Open Supabase <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {/* Tech Stack & Architecture Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 text-slate-700/30">
            <Server size={140} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3 text-slate-300">
              <Layers size={18} /> <h3 className="font-semibold text-base">Product Architecture</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-sm max-w-2xl">
              {data.productArchitecture}
            </p>
          </div>
        </motion.div>

        <div className="dashboard-card">
          <div className="flex items-center gap-2 mb-4 text-text-primary">
            <Cpu size={18} className="text-sky-500" /> <h3 className="font-semibold text-sm">Recommended Stack</h3>
          </div>
          <div className="space-y-2">
            {data.techStack?.map((tech, idx) => (
              <a
                key={idx}
                href={tech.url || "#"}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-200 transition-all"
              >
                <div>
                  <div className="font-semibold text-xs text-text-primary group-hover:text-sky-600 transition-colors">{tech.name}</div>
                  <div className="text-[10px] text-text-muted">{tech.category}</div>
                </div>
                <ExternalLink size={12} className="text-slate-300 group-hover:text-sky-500 transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="dashboard-card overflow-x-auto">
        <h3 className="font-semibold text-sm text-text-primary mb-5 flex items-center gap-2">
          <Box size={18} className="text-violet-500"/> Kanban Roadmap
        </h3>

        <div className="flex gap-5 min-w-[700px]">
          {/* NOW Column */}
          <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider">NOW</h4>
              <span className="bg-sky-50 text-sky-600 text-[10px] py-0.5 px-2 rounded-full font-semibold">{data.kanbanRoadmap?.now?.length || 0}</span>
            </div>
            <div className="space-y-2">
              {data.kanbanRoadmap?.now?.map((item, idx) => (
                <motion.div whileHover={{ y: -2 }} key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-1.5">
                  <span className={`self-start text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-md ${
                    item.priority === 'High' ? 'bg-red-50 text-red-600' :
                    item.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.priority}
                  </span>
                  <p className="text-xs text-text-primary font-medium">{item.task}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* NEXT Column */}
          <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider">NEXT</h4>
              <span className="bg-violet-50 text-violet-600 text-[10px] py-0.5 px-2 rounded-full font-semibold">{data.kanbanRoadmap?.next?.length || 0}</span>
            </div>
            <div className="space-y-2">
              {data.kanbanRoadmap?.next?.map((item, idx) => (
                <motion.div whileHover={{ y: -2 }} key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-1.5">
                  <span className={`self-start text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-md ${
                    item.priority === 'High' ? 'bg-red-50 text-red-600' :
                    item.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {item.priority}
                  </span>
                  <p className="text-xs text-text-primary font-medium">{item.task}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* LATER Column */}
          <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
              <h4 className="font-semibold text-xs text-text-primary uppercase tracking-wider">LATER</h4>
              <span className="bg-slate-100 text-slate-500 text-[10px] py-0.5 px-2 rounded-full font-semibold">{data.kanbanRoadmap?.later?.length || 0}</span>
            </div>
            <div className="space-y-2">
              {data.kanbanRoadmap?.later?.map((item, idx) => (
                <motion.div whileHover={{ y: -2 }} key={idx} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-1.5 opacity-70">
                  <span className="self-start text-[9px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-md bg-slate-50 text-slate-400">
                    {item.priority}
                  </span>
                  <p className="text-xs text-text-secondary font-medium">{item.task}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline & MVP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="dashboard-card">
          <h3 className="font-semibold text-sm text-text-primary mb-4">Development Timeline</h3>
          <div className="space-y-4">
            {data.developmentTimeline?.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-16 shrink-0 text-right">
                  <div className="text-[10px] font-bold text-sky-500 uppercase">{item.phase}</div>
                  <div className="text-[10px] text-text-muted">{item.duration}</div>
                </div>
                <div className="w-px bg-slate-200 relative">
                  <div className="absolute top-1 -left-1 w-2.5 h-2.5 rounded-full bg-sky-500 ring-4 ring-white" />
                </div>
                <div className="pb-4 pt-0.5">
                  <p className="text-xs text-text-primary">{item.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="font-semibold text-sm text-text-primary mb-4">MVP Core Features</h3>
          <ul className="space-y-3">
            {data.mvpFeatures?.map((feature, idx) => (
              <li key={idx} className="flex gap-3">
                <div className="mt-0.5 shrink-0"><CheckCircle size={14} className="text-emerald-500" /></div>
                <div>
                  <h4 className="font-medium text-xs text-text-primary">{feature.name}</h4>
                  <p className="text-xs text-text-secondary mt-0.5">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
