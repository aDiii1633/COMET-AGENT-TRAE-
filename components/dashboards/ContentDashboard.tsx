"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCircle, Heart, Instagram, Youtube, Linkedin, Twitter, Mail, Facebook, Hash, ArrowRight, Sparkles } from "lucide-react";
import type { ContentAgentOutput, ContentItem } from "@/lib/content-agent";

function SocialCard({ item, type, icon: Icon, colorClass, bgColor }: { item: ContentItem, type: string, icon: React.ElementType, colorClass: string, bgColor: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(item.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className={`px-4 py-2.5 border-b border-slate-50 flex items-center justify-between ${bgColor}`}>
        <div className="flex items-center gap-2 font-semibold text-xs text-text-primary">
          <Icon size={14} className={colorClass} /> {type}
        </div>
        <button onClick={handleCopy} className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/50" title="Copy Content">
          {copied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
      </div>
      <div className="p-4 flex-1">
        {/* Hook */}
        {item.hook && (
          <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <Sparkles size={10} /> Trending Hook
            </span>
            <p className="text-xs text-amber-800 font-medium">{item.hook}</p>
          </div>
        )}
        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">{item.content}</p>
        
        <div className="mt-3 flex gap-2">
          <button 
            onClick={() => { navigator.clipboard.writeText(item.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
            Copy Caption
          </button>
          <button 
            onClick={() => { navigator.clipboard.writeText(item.hashtags?.map(t => `#${t.replace('#','')}`).join(' ') || ''); }}
            className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Hash size={12} />
            Copy Hashtags
          </button>
        </div>

        {/* CTA */}
        {item.cta && (
          <div className="mt-3 p-2 rounded-lg bg-sky-50 border border-sky-100">
            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider flex items-center gap-1 mb-0.5">
              <ArrowRight size={10} /> Call to Action
            </span>
            <p className="text-xs text-sky-800 font-medium">{item.cta}</p>
          </div>
        )}
        {item.postReelIdea && (
          <div className="mt-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-text-secondary">
            <span className="font-semibold block mb-1 text-text-primary text-[10px] uppercase tracking-wider">Visual / Hook Idea</span>
            {item.postReelIdea}
          </div>
        )}
      </div>
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-text-muted">
        <div className="flex gap-1.5 max-w-[60%] overflow-hidden">
          <div className="flex gap-1.5 truncate">
            {item.hashtags?.map((t,i) => (
              <span key={i} className={`${colorClass} font-medium`}>#{t.replace('#','')}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span>{item.characterCount} chars</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600" title="Engagement Score">
            <Heart size={10} fill="currentColor" /> {item.engagementScore}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function ContentDashboard({ data }: { data: ContentAgentOutput }) {
  const tabs = [
    { id: "linkedin", label: "LinkedIn", icon: Linkedin, data: data.linkedinPosts, color: "text-[#0a66c2]", bg: "bg-[#0a66c2]/5" },
    { id: "twitter", label: "X (Twitter)", icon: Twitter, data: data.twitterPosts, color: "text-slate-800", bg: "bg-slate-50" },
    { id: "instagram", label: "Instagram", icon: Instagram, data: data.instagramIdeas, color: "text-pink-500", bg: "bg-gradient-to-r from-pink-50 to-purple-50" },
    { id: "facebook", label: "Facebook", icon: Facebook, data: data.facebookPosts, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "youtube", label: "YouTube", icon: Youtube, data: data.youtubeIdeas, color: "text-red-500", bg: "bg-red-50" },
    { id: "blog", label: "Blog", icon: Hash, data: data.blogIdeas, color: "text-sky-500", bg: "bg-sky-50" },
    { id: "newsletter", label: "Newsletter", icon: Mail, data: data.newsletterTopics, color: "text-violet-500", bg: "bg-violet-50" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const currentTab = tabs.find(t => t.id === activeTab);

  return (
    <div className="space-y-5">

      {/* Platform Navigation */}
      <div className="flex flex-wrap gap-2 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? `${tab.bg} ${tab.color} ring-1 ring-current shadow-sm`
                : "bg-white text-text-muted hover:bg-slate-50 border border-slate-100"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
            {tab.data && tab.data.length > 0 && (
              <span className="text-[10px] bg-white/60 px-1.5 py-0.5 rounded-full">{tab.data.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {currentTab?.data?.map((item, idx) => (
            <SocialCard
              key={idx}
              item={item}
              type={currentTab.label}
              icon={currentTab.icon}
              colorClass={currentTab.color}
              bgColor={currentTab.bg}
            />
          ))}
          {(!currentTab?.data || currentTab.data.length === 0) && (
            <div className="col-span-full py-16 text-center text-text-muted bg-white rounded-2xl border border-slate-100 border-dashed">
              <div className="mb-2 text-3xl">📝</div>
              No content generated for this platform.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
