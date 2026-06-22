/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { AGENT_LIST } from "./sidebar";
import { AgentRuntimeStatus } from "@/lib/site-data";
import { Download, RefreshCw, Eye, Copy, Play } from "lucide-react";
import { OrchestratorOutput } from "@/lib/orchestrator";

interface AgentOutputCardsProps {
  statuses: Record<string, AgentRuntimeStatus>;
  selectedAgents: Record<string, boolean>;
  onToggleAgent: (id: string) => void;
  onGenerateSingle: (id: string) => void;
  onViewOutput: (id: string) => void;
  hasOutput: Record<string, boolean>;
  results: OrchestratorOutput | null;
}

// Per-agent export format config
const EXPORT_CONFIG: Record<string, { ext: string; mime: string; label: string }> = {
  research: { ext: ".pdf", mime: "application/pdf", label: "Export .pdf" },
  strategy: { ext: ".pdf", mime: "application/pdf", label: "Export .pdf" },
  content: { ext: ".txt", mime: "text/plain;charset=utf-8", label: "Export .txt" },
  development: { ext: ".md", mime: "text/markdown;charset=utf-8", label: "Export .md" },
  pitch: { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", label: "Export .pptx" },
};

export function AgentOutputCards({
  statuses,
  selectedAgents,
  onToggleAgent,
  onGenerateSingle,
  onViewOutput,
  hasOutput,
  results,
}: AgentOutputCardsProps) {

  const getOutputMarkdown = (id: string): string => {
    if (!results) return "No output generated yet.";

    try {
      const res: any = results;
      switch (id) {
        case "research":
          return `# Research Output\n\n**Market Potential:** ${res.research?.marketPotential || ""}\n**Competition Level:** ${res.research?.competitionLevel || ""}\n**Opportunity Score:** ${res.research?.opportunityScore || ""}/100\n\n## Executive Summary\n${res.research?.executiveSummary || ""}\n\n## Competitors\n${res.research?.competitors?.map((c: any) => `- **${c.name}**: ${c.strength} | Weakness: ${c.weakness} | Position: ${c.position}`).join('\n') || ""}\n\n## Market Sizes\n- TAM: ${res.research?.marketSizes?.tam || ""}\n- SAM: ${res.research?.marketSizes?.sam || ""}\n- SOM: ${res.research?.marketSizes?.som || ""}\n\n## Industry Trends\n${res.research?.industryTrends?.map((t: any) => `- **${t.year}**: ${t.trend} — ${t.impact}`).join('\n') || ""}\n\n## Opportunities\n${res.research?.opportunities?.map((o: any) => `- ${o}`).join('\n') || ""}\n\n## Risks\n${res.research?.risks?.map((r: any) => `- ${r}`).join('\n') || ""}\n\n## Recommendations\n${res.research?.recommendations?.map((r: any) => `- ${r}`).join('\n') || ""}`;
        case "strategy":
          return `# Strategy Output\n\n**Business Name:** ${res.strategy?.businessName || ""}\n**Tagline:** ${res.strategy?.tagline || ""}\n**USP:** ${res.strategy?.usp || ""}\n\n## Revenue Model Canvas\n### Customer Segments\n${res.strategy?.revenueModelCanvas?.customerSegments?.map((c: any) => `- ${c}`).join('\n') || ""}\n### Value Propositions\n${res.strategy?.revenueModelCanvas?.valuePropositions?.map((c: any) => `- ${c}`).join('\n') || ""}\n### Channels\n${res.strategy?.revenueModelCanvas?.channels?.map((c: any) => `- ${c}`).join('\n') || ""}\n### Revenue Streams\n${res.strategy?.revenueModelCanvas?.revenueStreams?.map((c: any) => `- ${c}`).join('\n') || ""}\n\n## Pricing Strategy\n${res.strategy?.pricingStrategy || ""}\n\n## Growth Channels\n${res.strategy?.growthChannels?.map((c: any) => `- ${c}`).join('\n') || ""}\n\n## Roadmap\n${res.strategy?.roadmapTimeline?.map((r: any) => `### ${r.phase}: ${r.title}\n${r.description}`).join('\n\n') || ""}`;
        case "content":
          return `Content Agent Output\n\n${JSON.stringify(res.content, null, 2)}`;
        case "development":
          return `# Development Output\n\n## Product Architecture\n${res.development?.productArchitecture || ""}\n\n## Tech Stack\n${res.development?.techStack?.map((t: any) => `- **${t.name}** (${t.category}) — ${t.url || ""}`).join('\n') || ""}\n\n## Kanban Roadmap\n### NOW\n${res.development?.kanbanRoadmap?.now?.map((k: any) => `- [${k.priority}] ${k.task}`).join('\n') || ""}\n### NEXT\n${res.development?.kanbanRoadmap?.next?.map((k: any) => `- [${k.priority}] ${k.task}`).join('\n') || ""}\n### LATER\n${res.development?.kanbanRoadmap?.later?.map((k: any) => `- [${k.priority}] ${k.task}`).join('\n') || ""}\n\n## MVP Features\n${res.development?.mvpFeatures?.map((f: any) => `- **${f.name}**: ${f.description}`).join('\n') || ""}\n\n## Timeline\n${res.development?.developmentTimeline?.map((t: any) => `- **${t.phase}** (${t.duration}): ${t.goal}`).join('\n') || ""}`;
        case "pitch":
          return "Pitch deck — use Export .pptx for PowerPoint download.";
        default:
          return "";
      }
    } catch {
      const outputData = (results as any)[id];
      if (outputData) {
        return "```json\n" + JSON.stringify(outputData, null, 2) + "\n```";
      }
      return "";
    }
  };

  // Only Content Agent gets copy
  const handleCopy = (id: string) => {
    const text = getOutputMarkdown(id);
    navigator.clipboard.writeText(text);
  };

  const handleExport = async (id: string, name: string) => {
    const config = EXPORT_CONFIG[id];

    if ((id === "research" || id === "strategy") && results) {
      try {
        const { jsPDF } = await import("jspdf");
        const autoTable = (await import("jspdf-autotable")).default;
        const doc = new jsPDF();
        
        doc.setFont("helvetica");
        
        if (id === "research") {
          const res: any = results;
          const data = res.research;
          doc.setFontSize(22);
          doc.text("Research Report", 14, 20);
          
          doc.setFontSize(16);
          doc.text("Executive Summary", 14, 30);
          doc.setFontSize(12);
          const splitSummary = doc.splitTextToSize(data.executiveSummary || "N/A", 180);
          doc.text(splitSummary, 14, 40);
          
          let yPos = 40 + (splitSummary.length * 5) + 10;
          
          doc.setFontSize(16);
          doc.text("Market Analysis", 14, yPos);
          doc.setFontSize(12);
          yPos += 10;
          doc.text(`Market Potential: ${data.marketPotential}`, 14, yPos);
          yPos += 7;
          doc.text(`Competition Level: ${data.competitionLevel}`, 14, yPos);
          yPos += 7;
          doc.text(`Opportunity Score: ${data.opportunityScore}/100`, 14, yPos);
          
          yPos += 15;
          doc.setFontSize(16);
          doc.text("Competitor Analysis", 14, yPos);
          
          if (data.competitors && data.competitors.length > 0) {
            autoTable(doc, {
              startY: yPos + 5,
              head: [['Company', 'Strength', 'Weakness', 'Position']],
              body: data.competitors.map((c: any) => [c.name, c.strength, c.weakness, c.position]),
            });
            yPos = (doc as any).lastAutoTable.finalY + 15;
          } else {
            yPos += 10;
          }
          
          if (yPos > 250) { doc.addPage(); yPos = 20; }
          doc.setFontSize(16);
          doc.text("Recommendations", 14, yPos);
          doc.setFontSize(12);
          yPos += 10;
          data.recommendations?.forEach((r: any) => {
            const splitR = doc.splitTextToSize(`• ${r}`, 180);
            doc.text(splitR, 14, yPos);
            yPos += splitR.length * 5;
          });
          
        } else if (id === "strategy") {
          const res: any = results;
          const data = res.strategy;
          doc.setFontSize(22);
          doc.text("Strategy Plan", 14, 20);
          
          doc.setFontSize(16);
          doc.text("Business Overview", 14, 30);
          doc.setFontSize(12);
          doc.text(`Name: ${data.businessName}`, 14, 40);
          doc.text(`Tagline: ${data.tagline}`, 14, 47);
          
          const splitUsp = doc.splitTextToSize(`USP: ${data.usp}`, 180);
          doc.text(splitUsp, 14, 54);
          let yPos = 54 + (splitUsp.length * 5) + 10;
          
          doc.setFontSize(16);
          doc.text("Revenue Model", 14, yPos);
          doc.setFontSize(12);
          yPos += 10;
          data.revenueModelCanvas?.revenueStreams?.forEach((r: any) => {
            doc.text(`• ${r}`, 14, yPos);
            yPos += 7;
          });
          
          yPos += 10;
          doc.setFontSize(16);
          doc.text("Growth Strategy", 14, yPos);
          doc.setFontSize(12);
          yPos += 10;
          data.growthChannels?.forEach((c: any) => {
            doc.text(`• ${c}`, 14, yPos);
            yPos += 7;
          });
          
          if (yPos > 230) { doc.addPage(); yPos = 20; }
          yPos += 10;
          doc.setFontSize(16);
          doc.text("Launch Roadmap", 14, yPos);
          doc.setFontSize(12);
          yPos += 10;
          data.roadmapTimeline?.forEach((r: any) => {
            if (yPos > 270) { doc.addPage(); yPos = 20; }
            doc.setFont("helvetica", "bold");
            doc.text(`${r.phase}: ${r.title}`, 14, yPos);
            doc.setFont("helvetica", "normal");
            yPos += 6;
            const splitDesc = doc.splitTextToSize(r.description, 180);
            doc.text(splitDesc, 14, yPos);
            yPos += (splitDesc.length * 5) + 5;
          });
        }
        
        doc.save(`${name.toLowerCase().replace(/\s+/g, '-')}-output.pdf`);
      } catch (err) {
        console.error("PDF generation failed:", err);
        alert("Failed to generate PDF. Please try again.");
      }
      return;
    }

    if (id === "pitch" && results) {
      // Dynamic import of pptxgenjs for Pitch
      try {
        const PptxGenJS = (await import("pptxgenjs")).default;
        const pptx = new PptxGenJS();
        pptx.layout = "LAYOUT_WIDE";

        const res: any = results;
        const slides = res.pitch?.slides;
        if (!slides) return;

        const slideEntries = [
          { key: "problem", label: "THE PROBLEM" },
          { key: "solution", label: "OUR SOLUTION" },
          { key: "market", label: "MARKET SIZE" },
          { key: "revenue", label: "REVENUE MODEL" },
          { key: "advantage", label: "UNFAIR ADVANTAGE" },
          { key: "futureVision", label: "FUTURE VISION" },
        ];

        for (const entry of slideEntries) {
          const slideData = slides[entry.key];
          if (!slideData) continue;

          const slide = pptx.addSlide();
          slide.background = { fill: "0F172A" };

          slide.addText(entry.label, {
            x: 0.8, y: 0.5, w: 8, h: 0.5,
            fontSize: 12, color: "38BDF8", bold: true,
            fontFace: "Arial",
          });

          slide.addText(slideData.title || "", {
            x: 0.8, y: 1.2, w: 8, h: 1,
            fontSize: 28, color: "FFFFFF", bold: true,
            fontFace: "Arial",
          });

          slide.addText(slideData.content || "", {
            x: 0.8, y: 2.5, w: 7, h: 3,
            fontSize: 14, color: "CBD5E1",
            fontFace: "Arial",
            lineSpacingMultiple: 1.3,
          });

          if (slideData.metric) {
            slide.addText(slideData.metric, {
              x: 8.5, y: 1.2, w: 4, h: 1,
              fontSize: 24, color: "38BDF8", bold: true,
              fontFace: "Arial", align: "center",
            });
          }
        }

        await pptx.writeFile({ fileName: `${name.toLowerCase().replace(/\s+/g, '-')}-pitch.pptx` });
      } catch (err) {
        console.error("PPTX generation failed:", err);
        alert("Failed to generate PowerPoint. Please try again.");
      }
      return;
    }

    // Standard text export
    const text = getOutputMarkdown(id);
    const blob = new Blob([text], { type: config.mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.toLowerCase().replace(/\s+/g, '-')}-output${config.ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {AGENT_LIST.map((agent, i) => {
        const isSelected = selectedAgents[agent.id] ?? false;
        const status = statuses[agent.id] || "Queued";
        const outputExists = hasOutput[agent.id] ?? false;
        const Icon = agent.icon;
        const exportConfig = EXPORT_CONFIG[agent.id];

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`bg-white rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md ${
              isSelected ? "border-sky-200 ring-1 ring-sky-100" : "border-slate-100"
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 ${agent.bg} rounded-xl`}>
                  <Icon className={`w-5 h-5 ${agent.color}`} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5 font-medium">
                    {status === "Loading" ? "Generating..." : status === "Completed" ? "Output Ready" : "Awaiting Task"}
                  </p>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => onToggleAgent(agent.id)}
                />
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-sky-500 border-sky-500"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </label>
            </div>

            <div className="space-y-2.5">
              {!outputExists ? (
                <button
                  onClick={() => onGenerateSingle(agent.id)}
                  disabled={status === "Loading"}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-sm font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 text-text-secondary"
                >
                  {status === "Loading" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-500" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>Generate Output</span>
                    </>
                  )}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onViewOutput(agent.id)}
                    className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 text-sm font-medium transition-all flex items-center justify-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Output</span>
                  </button>
                  <div className={`grid ${agent.id === "content" ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
                    <button
                      onClick={() => onGenerateSingle(agent.id)}
                      className="py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium transition-all flex items-center justify-center space-x-1 text-text-secondary"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regen</span>
                    </button>
                    {/* Only Content Agent gets Copy button */}
                    {agent.id === "content" && (
                      <button
                        onClick={() => handleCopy(agent.id)}
                        className="py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium transition-all flex items-center justify-center space-x-1 text-text-secondary"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleExport(agent.id, agent.name)}
                      className="py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-medium transition-all flex items-center justify-center space-x-1 text-text-secondary"
                    >
                      <Download className="w-3 h-3" />
                      <span>{exportConfig.label}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
