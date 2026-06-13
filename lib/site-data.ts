import {
  Blocks,
  Compass,
  FileText,
  Lightbulb,
  Microscope,
  type LucideIcon,
} from "lucide-react";

export type AgentStep = {
  id: string;
  name: string;
  summary: string;
  detail: string;
  icon: LucideIcon;
};

export type AgentRuntimeStatus = "Queued" | "Loading" | "Completed";

export type ResultCard = {
  id: string;
  title: string;
  label: string;
  bullets: string[];
  metric: string;
};

export const defaultPrompt =
  "Build an AI startup copilot for solo founders and surface a go-to-market plan.";

export const trustItems = [
  "2.4M startup signals mapped",
  "91% faster validation cycles",
  "5 expert agents in one execution loop",
];

export const workflowSteps: AgentStep[] = [
  {
    id: "research",
    name: "Research Agent",
    summary: "Maps category signals, buyer demand, and whitespace opportunities.",
    detail: "Synthesizes competitor gaps, founder pain points, and market momentum into a concise opportunity frame.",
    icon: Microscope,
  },
  {
    id: "strategy",
    name: "Strategy Agent",
    summary: "Converts raw insight into positioning, ICP, and launch priorities.",
    detail: "Builds the wedge, pricing angle, retention hypothesis, and first-month roadmap for execution clarity.",
    icon: Compass,
  },
  {
    id: "content",
    name: "Content Agent",
    summary: "Writes the narrative, messaging pillars, and channel-ready assets.",
    detail: "Turns the plan into landing page copy, campaign hooks, and founder-facing announcements with one voice.",
    icon: FileText,
  },
  {
    id: "development",
    name: "Development Agent",
    summary: "Translates strategy into product scope, milestones, and build tasks.",
    detail: "Creates MVP architecture notes, feature slices, and delivery checkpoints for shipping the first release.",
    icon: Blocks,
  },
  {
    id: "pitch",
    name: "Pitch Agent",
    summary: "Packages traction, story, and investor messaging into a fundable narrative.",
    detail: "Frames the opportunity with market proof, growth logic, and a clean pitch summary for demos or investor calls.",
    icon: Lightbulb,
  },
];

export const resultCards: ResultCard[] = [
  {
    id: "market",
    title: "Market Pulse",
    label: "Research output",
    metric: "18 demand clusters",
    bullets: [
      "Solo founders rank cash-flow clarity as the most urgent pain point.",
      "Bookkeeping automation tools under-serve founders who need decision support, not only categorization.",
      "The strongest wedge starts with weekly runway alerts and founder-ready summaries.",
    ],
  },
  {
    id: "strategy",
    title: "Launch Blueprint",
    label: "Strategy output",
    metric: "30-day rollout",
    bullets: [
      "Target pre-seed founders, fractional CFOs, and founder-led SaaS operators first.",
      "Lead with the promise: know your runway, burn, and next move from one prompt.",
      "Sequence launch around founder communities, partner accountants, and a product-led waitlist.",
    ],
  },
  {
    id: "content",
    title: "Messaging System",
    label: "Content output",
    metric: "12 reusable assets",
    bullets: [
      "Headline angle: Your AI finance chief of staff for startup survival and growth.",
      "Email and social hooks focus on confidence, speed, and investor-ready clarity.",
      "Landing page copy balances premium polish with decisive, no-fluff COMET AGENT language.",
    ],
  },
  {
    id: "build",
    title: "Product Stack",
    label: "Development output",
    metric: "9 sprint tasks",
    bullets: [
      "Prioritize transaction sync, plain-language summaries, and KPI anomaly detection.",
      "Defer advanced forecasting until after baseline habit loops are established.",
      "Use modular feature slices so the MVP can ship in weeks, not quarters.",
    ],
  },
  {
    id: "pitch",
    title: "Investor Story",
    label: "Pitch output",
    metric: "7-slide arc",
    bullets: [
      "Narrative centers on replacing fragmented finance tools with one founder-native interface.",
      "The moat combines workflow automation, startup-specific insight, and execution continuity.",
      "The close ties early retention to weekly financial confidence, not vanity engagement.",
    ],
  },
];

export const statHighlights = [
  { label: "Prompt to plan", value: "43 sec" },
  { label: "Signals reviewed", value: "12k+" },
  { label: "Founders onboarded", value: "480" },
];
