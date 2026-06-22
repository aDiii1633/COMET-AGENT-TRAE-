# Comet Agent - AI Workforce Platform

**Comet Agent** is a premium, multi-agent AI workforce dashboard designed to help solo founders instantly validate, strategize, build, and pitch their startup ideas. Instead of managing siloed conversations with general-purpose AI, Comet Agent coordinates a squad of specialized agent virtual specialists to deliver cohesive, actionable plans and deliverables in one unified flow.

---

## 🚀 Key Features

*   **Business Orchestrator:** Input your startup idea and select which agents to run. Watch as the agents execute sequentially to build a complete startup plan, from market research to developer scoping and pitch deck creation.
*   **Agent Playground:** Drill down into specific agents (Research, Strategy, Content, Dev, or Pitch) to test prompts and explore their outputs in isolation.
*   **Beautiful, Premium UI:** Styled with a sleek glassmorphic theme, custom slate & sky HSL color palettes, responsive sidebars, status trackers, and fluid animations.
*   **Gemini AI Integration:** Utilizes the `@google/genai` SDK to dynamically generate tailored startup insights.

---

## 🛠️ Tech Stack

*   **Core:** React 19, Next.js 15 (App Router), TypeScript
*   **Styling:** Tailwind CSS v4 (Custom theme & variables), Lucide Icons
*   **AI SDK:** `@google/genai`
*   **Libraries:** Framer Motion (animations), Recharts (data visualizations), jsPDF & PPTXGenJS (export formats)

---

## ⚙️ Getting Started

Follow these steps to run Comet Agent locally:

### 1. Clone the Repository
```bash
git clone https://github.com/aDiii1633/COMET-AGENT-TRAE-.git
cd COMET-AGENT-TRAE-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file and add your Gemini API Key:
```bash
cp .env.example .env.local
```
Edit `.env.local` and enter your key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for Production
To verify compilation and optimize the bundle:
```bash
npm run build
```

---

## 🤖 AI Agent Log
Details on the prompts, agent tools, and AI workflows used to build the platform are documented in [`agent-log.md`](./agent-log.md).
