/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Layers, Layout, Target, Code, PenTool, Presentation } from "lucide-react";

interface HeroLandingProps {
  onStartBuilding: () => void;
}

export function HeroLanding({ onStartBuilding }: HeroLandingProps) {
  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const floatingVariants: any = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-sky-50 to-transparent -z-10" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/4 -right-32 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <header className="px-6 py-6 lg:px-12 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200/50">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">Comet Agent</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
            Sign In
          </button>
          <button 
            onClick={onStartBuilding}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Building
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 lg:px-12 pb-24 z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center mt-12 lg:mt-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-xs font-semibold tracking-wide uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Next-Gen Business Creation
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
            Your AI Workforce for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
              Business Creation
            </span>
          </motion.h1>

          {/* Problem & Solution text */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto space-y-4 mb-10">
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              <span className="text-slate-800 font-semibold">Problem:</span> Creators, founders, and indie hackers switch between multiple tools for research, strategy, content, development, and pitching.
            </p>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">
              <span className="text-sky-600 font-semibold">Solution:</span> Comet Agent unifies everything through specialized AI agents and powerful orchestration.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button 
              onClick={onStartBuilding}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-sky-500 text-white font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-sky-200/50 flex items-center justify-center gap-2 group"
            >
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-700 border border-slate-200 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Layers className="w-5 h-5 text-slate-400" />
              Explore Agents
            </button>
          </motion.div>

          {/* AI Workforce Visualization */}
          <motion.div id="explore" variants={itemVariants} className="relative w-full max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-slate-50/50 backdrop-blur-xl border border-slate-100 rounded-3xl p-6 md:p-10 shadow-2xl shadow-sky-100/50 overflow-hidden relative">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-left mb-8">The Unified Agent Pipeline</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-20">
                {/* Agent Cards */}
                {[
                  { icon: Target, name: "Research", desc: "Market & Competitors", color: "text-sky-500", bg: "bg-sky-50" },
                  { icon: Layout, name: "Strategy", desc: "Business & Pricing", color: "text-violet-500", bg: "bg-violet-50" },
                  { icon: PenTool, name: "Content", desc: "Multi-platform Social", color: "text-pink-500", bg: "bg-pink-50" },
                  { icon: Code, name: "Dev", desc: "Architecture & Roadmap", color: "text-emerald-500", bg: "bg-emerald-50" },
                  { icon: Presentation, name: "Pitch", desc: "Investor Deck PPTX", color: "text-amber-500", bg: "bg-amber-50" }
                ].map((agent, i) => (
                  <motion.div 
                    key={agent.name}
                    variants={floatingVariants}
                    animate="animate"
                    style={{ animationDelay: `${i * 0.2}s` }}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-sky-100 transition-all text-left group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${agent.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <agent.icon className={`w-5 h-5 ${agent.color}`} />
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{agent.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{agent.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-sky-100 via-sky-300 to-sky-100 -z-10" />
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
