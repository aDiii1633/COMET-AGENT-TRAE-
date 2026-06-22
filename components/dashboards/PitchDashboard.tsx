"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Presentation, Download } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PitchAgentOutput } from "@/lib/pitch-agent";

export function PitchDashboard({ data }: { data: PitchAgentOutput }) {
  const slidesList = [
    { id: "problem", data: { title: "The Problem", content: data.problem, metric: "Critical Issue" } },
    { id: "solution", data: { title: "Our Solution", content: data.solution, metric: "10x Better" } },
    { id: "market", data: { title: "Market Size & Opportunity", content: data.market, metric: "$10B+ TAM", graphType: "Pie" as const, graphData: [{ name: "TAM", value: 70 }, { name: "SAM", value: 20 }, { name: "SOM", value: 10 }] } },
    { id: "revenue", data: { title: "Revenue Model", content: data.businessModel, metric: "High Margin", graphType: "Bar" as const, graphData: [{ name: "Year 1", value: 10 }, { name: "Year 2", value: 30 }, { name: "Year 3", value: 90 }] } },
    { id: "advantage", data: { title: "Competitive Advantage", content: data.competitiveAdvantage, metric: "Defensible" } },
    { id: "futureVision", data: { title: "Future Vision", content: data.futureVision, metric: "Scale" } },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((p) => Math.min(p + 1, slidesList.length - 1));
  const prevSlide = () => setCurrentSlide((p) => Math.max(p - 1, 0));

  const slide = slidesList[currentSlide]?.data;

  const COLORS = ["#0EA5E9", "#10B981", "#8B5CF6", "#F59E0B"];

  const slideGradients = [
    "from-slate-800 to-slate-900",
    "from-sky-800 to-blue-900",
    "from-violet-800 to-purple-900",
    "from-emerald-800 to-teal-900",
    "from-amber-800 to-orange-900",
    "from-indigo-800 to-blue-900",
  ];

  const handleDownloadPPT = async () => {
    try {
      const PptxGenJS = (await import("pptxgenjs")).default;
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";

      const slideEntries = [
        { key: "problem", label: "THE PROBLEM" },
        { key: "solution", label: "OUR SOLUTION" },
        { key: "market", label: "MARKET SIZE" },
        { key: "revenue", label: "REVENUE MODEL" },
        { key: "advantage", label: "UNFAIR ADVANTAGE" },
        { key: "futureVision", label: "FUTURE VISION" },
      ];

      for (const entry of slideEntries) {
        const slideItem = slidesList.find(
          (s) =>
            s.id ===
            (entry.key === "advantage"
              ? "advantage"
              : entry.key === "revenue"
                ? "revenue"
                : entry.key)
        );
        const slideData = slideItem?.data;
        if (!slideData) continue;

        const s = pptx.addSlide();
        s.background = { fill: "0F172A" };

        s.addText(entry.label, {
          x: 0.8, y: 0.5, w: 8, h: 0.5,
          fontSize: 12, color: "38BDF8", bold: true, fontFace: "Arial",
        });

        s.addText(slideData.title || "", {
          x: 0.8, y: 1.2, w: 8, h: 1,
          fontSize: 28, color: "FFFFFF", bold: true, fontFace: "Arial",
        });

        s.addText(slideData.content || "", {
          x: 0.8, y: 2.5, w: 7, h: 3,
          fontSize: 14, color: "CBD5E1", fontFace: "Arial", lineSpacingMultiple: 1.3,
        });

        if (slideData.metric) {
          s.addText(slideData.metric, {
            x: 8.5, y: 1.2, w: 4, h: 1,
            fontSize: 24, color: "38BDF8", bold: true, fontFace: "Arial", align: "center",
          });
        }
      }

      await pptx.writeFile({ fileName: "investor-pitch-deck.pptx" });
    } catch (err) {
      console.error("PPTX generation failed:", err);
      alert("Failed to generate PowerPoint.");
    }
  };

  if (!slide) return null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
          <Presentation className="text-amber-500" size={18} /> Investor Pitch Deck
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted font-medium">Slide {currentSlide + 1} / {slidesList.length}</span>
          <div className="flex gap-1.5">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition-colors text-text-secondary border border-slate-200"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide === slidesList.length - 1}
              className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition-colors text-text-secondary border border-slate-200"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <button
            onClick={handleDownloadPPT}
            className="btn-primary flex items-center gap-2 text-xs py-2"
          >
            <Download size={14} /> Download PPT
          </button>
        </div>
      </div>

      {/* Landscape Slide */}
      <div className="slide-container w-full max-w-4xl mx-auto shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`absolute inset-0 bg-gradient-to-br ${slideGradients[currentSlide % slideGradients.length]} text-white p-8 md:p-12 flex flex-col justify-center`}
          >
            <div className="uppercase tracking-widest text-sky-400 text-[10px] font-bold mb-4">{slidesList[currentSlide].id.replace(/([A-Z])/g, ' $1').trim()}</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight max-w-2xl text-white">
              {slide.title}
            </h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap max-w-xl">
                {slide.content}
              </div>

              {(slide.metric || slide.graphType) && (
                <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-5">
                  {slide.metric && (
                    <div className="bg-white/10 backdrop-blur border border-white/10 p-5 rounded-xl text-center">
                      <div className="text-2xl font-bold text-sky-300">{slide.metric}</div>
                    </div>
                  )}

                  {slide.graphType === "Bar" && slide.graphData && (
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={slide.graphData}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                          <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {slide.graphType === "Pie" && slide.graphData && (
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={slide.graphData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value">
                            {slide.graphData.map(
                              (_: { name: string; value: number }, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              )
                            )}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Thumbnails */}
      <div className="flex justify-center gap-2 pt-2">
        {slidesList.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
              idx === currentSlide
                ? "bg-sky-500 text-white shadow-md shadow-sky-200/50"
                : "bg-slate-100 text-text-muted hover:bg-slate-200"
            }`}
          >
            {s.id.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
