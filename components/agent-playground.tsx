"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { AGENT_LIST } from "./sidebar";
import { Send, RefreshCw, User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface AgentPlaygroundProps {
  selectedAgentId: string | null;
  onSelectAgent: (id: string) => void;
}

type Message = { role: "user" | "ai"; content: string };

export function AgentPlayground({ selectedAgentId, onSelectAgent }: AgentPlaygroundProps) {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedAgent = AGENT_LIST.find((a) => a.id === selectedAgentId);

  useEffect(() => {
    setHistory([]);
    setPrompt("");
  }, [selectedAgentId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const capabilities: Record<string, string[]> = {
    research: ["Competitor Analysis", "Market Research", "Industry Trends", "Audience Research"],
    strategy: ["Revenue Models", "Pricing", "Growth Strategy", "Product Positioning"],
    content: ["Blog Writing", "LinkedIn Posts", "Newsletter Writing", "Twitter Content", "YouTube Ideas", "Marketing Copy"],
    development: ["MVP Planning", "Feature Planning", "Landing Page Creation", "Technical Architecture"],
    pitch: ["Investor Pitch", "Startup Deck", "Business Presentation", "Funding Strategy"],
  };

  const suggestions: Record<string, string[]> = {
    research: ["Analyze my competitors", "Find market opportunities", "Research industry trends"],
    strategy: ["Develop a growth strategy", "Suggest pricing models", "Create product positioning"],
    content: ["Create 30 Instagram post ideas", "Write a LinkedIn post", "Generate newsletter content", "Create YouTube scripts"],
    development: ["Plan an MVP roadmap", "Outline technical architecture", "Design a landing page structure"],
    pitch: ["Draft an investor pitch", "Create a startup deck outline", "Formulate a funding strategy"],
  };

  const handleSend = async () => {
    if (!prompt.trim() || !selectedAgentId || isLoading) return;

    const currentPrompt = prompt;
    setPrompt("");

    const newHistory: Message[] = [...history, { role: "user", content: currentPrompt }];
    setHistory(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: selectedAgentId,
          history: history,
          prompt: currentPrompt
        })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setHistory([...newHistory, { role: "ai", content: data.result }]);
    } catch (err) {
      console.error(err);
      setHistory([...newHistory, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedAgentId || !selectedAgent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-500 mb-6 shadow-lg shadow-sky-200/50">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-gradient">
              What do you need help with?
            </h1>
            <p className="text-text-secondary">Select a specialized AI agent to begin your focused workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AGENT_LIST.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <motion.button
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => onSelectAgent(agent.id)}
                  className="glass-card p-5 rounded-2xl text-left group"
                >
                  <div className={`p-3 ${agent.bg} rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${agent.color}`} />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-1">{agent.name}</h3>
                  <p className="text-xs text-text-muted line-clamp-2">
                    {capabilities[agent.id]?.join(" • ")}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  const Icon = selectedAgent.icon;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Agent Header Info */}
          {history.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-6 mb-10 p-6 glass-card rounded-2xl"
            >
              <div className={`p-4 ${selectedAgent.bg} rounded-2xl`}>
                <Icon className={`w-10 h-10 ${selectedAgent.color}`} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-text-primary mb-1">{selectedAgent.name}</h2>
                <p className="text-text-secondary text-sm mb-5">Dedicated workspace for specialized AI tasks.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3">Capabilities</h4>
                    <ul className="space-y-1.5">
                      {capabilities[selectedAgent.id]?.map((cap, idx) => (
                        <li key={idx} className="text-sm text-text-secondary flex items-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${selectedAgent.color.replace('text-', 'bg-')} mr-2 opacity-60`} />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-text-muted font-bold mb-3">Suggested Prompts</h4>
                    <ul className="space-y-1.5">
                      {suggestions[selectedAgent.id]?.map((sug, idx) => (
                        <li key={idx}>
                          <button
                            onClick={() => setPrompt(sug)}
                            className="text-sm text-accent hover:text-accent-deep transition-colors text-left"
                          >
                            → {sug}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Chat History */}
          <div className="space-y-5 pb-20">
            {history.length === 0 ? (
              <div className="flex justify-center">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-sky-50 text-sky-500 border border-sky-100">
                  Workspace Initialized
                </span>
              </div>
            ) : (
              history.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start max-w-[90%] space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                    <div className={`p-2 rounded-xl flex-shrink-0 mt-1 ${msg.role === "user" ? "bg-sky-100" : "bg-slate-100"}`}>
                      {msg.role === "user" ? <User className="w-4 h-4 text-sky-500" /> : <Icon className="w-4 h-4 text-slate-500" />}
                    </div>
                    <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-200/30"
                        : "bg-white border border-slate-100 text-text-primary shadow-sm"
                    }`}>
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:text-text-primary prose-a:text-accent hover:prose-a:text-accent-deep prose-strong:text-text-primary">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-start max-w-[85%] space-x-3">
                  <div className="p-2 rounded-xl flex-shrink-0 bg-slate-100">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-sm text-text-muted">Working...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 glass-panel border-t border-border">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask ${selectedAgent.name} to do something...`}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-5 pr-14 py-3.5 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 resize-none text-sm transition-all"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="absolute right-3 bottom-3 p-2.5 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
